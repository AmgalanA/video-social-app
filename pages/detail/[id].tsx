import axios from "axios";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useRef, useState } from "react";
import { BsFillPlayFill } from "react-icons/bs";
import { GoVerified } from "react-icons/go";
import { HiVolumeOff, HiVolumeUp } from "react-icons/hi";
import { MdOutlineCancel } from "react-icons/md";

import { Video } from "../../types";
import useAuthStore from "../../store/authStore";
import Comments from "../../components/Comments";
import LikeButton from "../../components/LikeButton";

interface IProps {
  postDetails: Video;
}

const detail: NextPage<IProps> = ({ postDetails }) => {
  const { back } = useRouter();

  const [post, setPost] = useState(postDetails);
  const [playing, setPlaying] = useState<boolean>(false);
  const [isVideoMutted, setIsVideoMutted] = useState<boolean>(false);
  const [comment, setComment] = useState("");
  const [isPostingComment, setIsPostingComment] = useState<boolean>(false);

  const { userProfile }: any = useAuthStore();

  const videoRef = useRef<HTMLVideoElement>(null);

  const onVideoClick = () => {
    if (playing) {
      videoRef.current?.pause();
      setPlaying(false);
    } else {
      videoRef.current?.play();
      setPlaying(true);
    }
  };

  useEffect(() => {
    if (post && videoRef.current) {
      videoRef.current.muted = isVideoMutted;
    }
  }, [post, isVideoMutted]);

  const handleLike = async (like: boolean) => {
    if (userProfile) {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/like`,
        {
          userId: userProfile._id,
          postId: post._id,
          like,
        }
      );

      setPost({ ...post, likes: data.likes });
    }
  };

  const addComment = async (e: FormEvent) => {
    e.preventDefault();

    if (userProfile && comment) {
      setIsPostingComment(true);

      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/${post._id}`,
        {
          userId: userProfile._id,
          comment,
        }
      );
      console.log(data);

      setPost({ ...post, comments: data.comments });
      setComment("");
      setIsPostingComment(false);
    }
  };
  console.log(post);

  if (!post) return null;

  return (
    <div className="flex w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap">
      <div className="relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-blurred-img bg-no-repeat bg-cover bg-center">
        <div className="absolute top-6 left-2 lg:left-6 flex gap-6 z-50">
          <p className="cursor-pointer" onClick={() => back()}>
            <MdOutlineCancel className="text-white text-[35px]" />
          </p>
        </div>

        <div className="relative">
          <div className="lg:h-[100vh] h-[60vh]">
            <video
              ref={videoRef}
              loop
              onClick={onVideoClick}
              className="h-full cursor-pointer"
              src={post.video.asset.url}
            ></video>
          </div>

          <div className="cursor-pointer absolute top-[45%] left-[45%]">
            {!playing && (
              <button onClick={onVideoClick}>
                <BsFillPlayFill className="text-white text-6xl lg:text-8xl" />
              </button>
            )}
          </div>
        </div>

        <div className="absolute bottom-5 lg:bottom-10 right-5 lg:right-10 cursor-pointer">
          {isVideoMutted ? (
            <button onClick={() => setIsVideoMutted(false)}>
              <HiVolumeOff className="text-black text-2xl lg:text-4xl " />
            </button>
          ) : (
            <button onClick={() => setIsVideoMutted(true)}>
              <HiVolumeUp className="text-black text-2xl lg:text-4xl " />
            </button>
          )}
        </div>
      </div>

      <div className="relative w-[1000px] md:w-[900px] lg:w-[700px]">
        <div className="lg:mt-20 mt-10 ">
          <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded">
            <div className="ml-4 md:w-20 md:h-20 w-16 h-16">
              <Link href={`/profile/${post.postedBy._id}`}>
                <>
                  <Image
                    width={62}
                    height={62}
                    className="rounded-full"
                    src={post.postedBy.image}
                    alt="profile photo"
                    layout="responsive"
                  />
                </>
              </Link>
            </div>

            <div>
              <Link href={`/profile/${post.postedBy._id}`}>
                <div className="mt-3 flex flex-col gap-2">
                  <p className="flex gap-2 items-center md:text-md font-bold text-primary">
                    {post.postedBy.userName}{" "}
                    <GoVerified className="text-blue-400 text-md" />
                  </p>
                  <p className="capitalize font-medium text-xs text-gray-500 hidden md:block">
                    {post.postedBy.userName}{" "}
                  </p>
                </div>
              </Link>
            </div>
          </div>

          <p className="px-10 text-md text-gray-600 text-lg">{post.caption}</p>

          <div className="mt-10 px-10">
            {userProfile && (
              <LikeButton
                likes={post.likes}
                handleLike={() => handleLike(true)}
                handleDislike={() => handleLike(false)}
              />
            )}
          </div>

          <Comments
            addComment={addComment}
            isPostingComment={isPostingComment}
            comments={post.comments}
            comment={comment}
            setComment={setComment}
          />
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { data } = await axios.get(`http://localhost:3000/api/post/${id}`);

  return {
    props: { postDetails: data },
  };
};

export default detail;

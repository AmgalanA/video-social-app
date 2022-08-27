import axios from "axios";
import { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GoVerified } from "react-icons/go";
import NoResults from "../../components/NoResults";
import VideoCard from "../../components/VideoCard";
import { IUser, Video } from "../../types";

interface IProps {
  data: {
    user: IUser;
    userVideos: Video[];
    userLikedVideos: Video[];
  };
}

const Profile: NextPage<IProps> = ({ data }) => {
  const [showUserVideos, setShowUserVideos] = useState(true);
  const [videosList, setVideosList] = useState<Video[]>([]);

  const { user, userVideos, userLikedVideos } = data;

  const videos = showUserVideos ? "border-b-2 border-black" : "text-gray-400";
  const liked = !showUserVideos ? "border-b-2 border-black" : "text-gray-400";

  useEffect(() => {
    if (showUserVideos) {
      setVideosList(userVideos);
    } else {
      setVideosList(userLikedVideos);
    }
  }, [showUserVideos, videos, userVideos]);

  return (
    <div>
      <div className="w-full">
        <div className="flex gap-6 md:gap-10 mb-4 bg-white w-full">
          <div className="w-16 h-16 md:w-32 md:h-32 ">
            <Image
              src={user.image}
              width={120}
              height={120}
              className="rounded-full"
              alt="user profile"
              layout="responsive"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="md:text-2xl tracking-wider flex gap-1 items-center justify-center text-md font-bold text-primary lowercase">
              {user.userName.replaceAll(" ", "")}
              <GoVerified className="text-blue-400" />
            </p>

            <p className="capitalize md:text-xl text-gray-400 text-xs">
              {user.userName}
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
          <p
            className={`text-xl font-semibold cursor-pointer mt-2 ${videos}`}
            onClick={() => setShowUserVideos(true)}
          >
            Videos
          </p>
          <p
            className={`text-xl font-semibold cursor-pointer mt-2 ${liked}`}
            onClick={() => setShowUserVideos(false)}
          >
            Liked
          </p>
        </div>

        <div className="flex gap-6 flex-wrap md:justify-start">
          {videosList.length > 0 ? (
            videosList.map((post: Video, index: number) => (
              <VideoCard post={post} key={index} />
            ))
          ) : (
            <NoResults
              text={`No ${showUserVideos ? "" : "Liked"} Videos Yet`}
            />
          )}
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
  const { data } = await axios.get(`http://localhost:3000/api/profile/${id}`);

  return {
    props: { data },
  };
};

export default Profile;

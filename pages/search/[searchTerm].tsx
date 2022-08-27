import axios from "axios";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { GoVerified } from "react-icons/go";
import NoResults from "../../components/NoResults";
import VideoCard from "../../components/VideoCard";
import useAuthStore from "../../store/authStore";
import { IUser, Video } from "../../types";

interface IProps {
  videos: Video[];
}

const Search: NextPage<IProps> = ({ videos }) => {
  const [isAccounts, setisAccounts] = useState(false);

  const { query } = useRouter();

  const { allUsers } = useAuthStore();

  const { searchTerm }: any = query;

  const accounts = isAccounts ? "border-b-2 border-black" : "text-gray-400";
  const isVideos = !isAccounts ? "border-b-2 border-black" : "text-gray-400";

  const searchedAccounts = allUsers.filter((user: IUser) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full ">
      <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
        <p
          className={`text-xl font-semibold cursor-pointer mt-2 ${accounts}`}
          onClick={() => setisAccounts(true)}
        >
          Accounts
        </p>
        <p
          className={`text-xl font-semibold cursor-pointer mt-2 ${isVideos}`}
          onClick={() => setisAccounts(false)}
        >
          Videos
        </p>
      </div>

      {isAccounts ? (
        <div className="md:mt-16">
          {searchedAccounts.length > 0 ? (
            searchedAccounts.map((user: IUser, index) => (
              <Link key={index} href={`/profile/${user._id}`}>
                <div className="flex p-2 cursor-pointer font-semibold rounded border-b-2 border-gray-200 gap-3">
                  <div>
                    <Image
                      src={user.image}
                      width={50}
                      height={50}
                      className="rounded-full"
                      alt="user profile"
                    />
                  </div>

                  <div className="hidden xl:block">
                    <p className="flex gap-1 items-center text-md font-bold text-primary lowercase">
                      {user.userName.replaceAll(" ", "")}
                      <GoVerified className="text-blue-400" />
                    </p>

                    <p className="capitalize text-gray-400 text-xs">
                      {user.userName}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <NoResults text={``} />
          )}
        </div>
      ) : (
        <div className="md:mt-16 flex flex-wrap gap-6 md:justify-start">
          {videos.length ? (
            videos.map((video: Video, index) => (
              <VideoCard post={video} key={index} />
            ))
          ) : (
            <NoResults text={`No video results for ${searchTerm}`} />
          )}
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = async ({
  params: { searchTerm },
}: {
  params: { searchTerm: string };
}) => {
  const { data } = await axios.get(
    `http://localhost:3000/api/search/${searchTerm}`
  );

  return {
    props: { videos: data },
  };
};
export default Search;

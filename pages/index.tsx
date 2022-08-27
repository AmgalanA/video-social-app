import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";
import NoResults from "../components/NoResults";
import VideoCard from "../components/VideoCard";
import { Video } from "../types";

interface IProps {
  videos: Video[];
}

const Home: NextPage<IProps> = ({ videos }) => {
  return (
    <div className="flex flex-col gap-10 videos h-full">
      {videos.length ? (
        videos.map((video) => <VideoCard key={video._id} post={video} />)
      ) : (
        <NoResults text={"No Videos"} />
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query: { topic },
}) => {
  let response = null;

  if (topic) {
    response = await axios.get(`http://localhost:3000/api/discover/${topic}`);
  } else {
    response = await axios.get(`http://localhost:3000/api/post`);
  }

  return {
    props: {
      videos: response.data,
    },
  };
};

export default Home;

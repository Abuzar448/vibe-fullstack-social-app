import React, { useState, useEffect } from "react";
import logo2 from "../assets/logo2.png";
import { FaRegHeart } from "react-icons/fa6";
import { LuMessageCircleMore } from "react-icons/lu";
import StoryCard from "./StoryCard";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import Post from "./Post";
import { useNavigate } from "react-router-dom";

const STORY_LIFETIME_MS = 24 * 60 * 60 * 1000;

const isStoryExpired = (story) => {
  if (!story?.createdAt) return false;
  return Date.now() - new Date(story.createdAt).getTime() > STORY_LIFETIME_MS;
};

const Feed = () => {
  const { postData } = useSelector((state) => state.post);
  const { userData } = useSelector((state) => state.user);
  const { storyList, currentUserStory } = useSelector((state) => state.story);
  const navigate = useNavigate();

  // forces a re-render every minute so expired stories drop off
  // even if no other state change triggers a re-render
  const [, forceTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => forceTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const activeStoryList = storyList?.filter((story) => !isStoryExpired(story));
  const activeCurrentUserStory = isStoryExpired(currentUserStory) ? null : currentUserStory;

  return (
    <div className="lg:w-[50%] w-full bg-black min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex justify-between w-full h-[100px] items-center p-[20px] lg:hidden">
        <img src={logo2} alt="" className="w-[90px]" />
        <div className="flex items-center gap-4">
          <FaRegHeart size={25} color="white" />
          <LuMessageCircleMore size={25} color="white" onClick={() => navigate('/messages')} />
        </div>
      </div>
      <div className="flex w-full overflow-auto gap-[10px] items-center p-[20px] overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <StoryCard
          username={"Your Story"}
          profilePicture={userData?.profilePicture}
          story={activeCurrentUserStory}
        />
        {activeStoryList?.map((story, idx) => (
          <StoryCard
            username={story?.author?.username}
            profilePicture={story?.author?.profilePicture}
            story={story}
            key={story?._id || idx}
          />
        ))}
      </div>
      <div className="w-full min-h-[100vh] flex flex-col items-center gap-[20px] p-[10px] pt-[40px] bg-white rounded-t-[70px] relative pb-[120px]">
        <Navbar></Navbar>
        {postData?.map((post, idx) => (
          <Post post={post} key={idx}></Post>
        ))}
      </div>
    </div>
  );
};

export default Feed;
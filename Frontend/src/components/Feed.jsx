import React from "react";
import logo2 from "../assets/logo2.png";
import { FaRegHeart } from "react-icons/fa6";
import StoryCard from "./StoryCard";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import Post from "./Post";

const Feed = () => {
  const { postData } = useSelector((state) => state.post);
  return (
    <div className="lg:w-[50%] w-full bg-black min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex justify-between w-full h-[100px] items-center p-[20px] lg:hidden">
        <img src={logo2} alt="" className="w-[90px]" />
        <div>
          <FaRegHeart size={25} color="white" />
        </div>
      </div>
      <div className="flex w-full overflow-auto gap-[10px] items-center p-[20px] overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <StoryCard></StoryCard>
        <StoryCard></StoryCard>
        <StoryCard></StoryCard>
        <StoryCard></StoryCard>
        <StoryCard></StoryCard>
        <StoryCard></StoryCard>
        <StoryCard></StoryCard>
        <StoryCard></StoryCard>
        <StoryCard></StoryCard>
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

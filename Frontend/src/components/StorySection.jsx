import React, { useEffect, useState } from "react";
import dp from "../assets/DP.webp";
import { useSelector } from "react-redux";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";

const StorySection = ({ storyData }) => {
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate("/");
          return 100;
        }
        return prev + 1;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="w-full max-w-[500px] h-[100vh] border-x-2 border-gray-800 pt-[10px] relative flex flex-col justify-center">
      <div className="w-full flex items-center gap-4 px-4 absolute top-8">
        <div className="cursor-pointer" onClick={() => navigate("/")}>
          <IoArrowBackOutline className="w-[25px] h-[25px] text-white" />
        </div>
        <div
          className="w-[50px] h-[50px] md:w-[40px] md:h-[40px] rounded-full border-1 border-black cursor-pointer overflow-hidden"
          onClick={() => {
            navigate(`/profile/${storyData?.author?.username}`);
          }}
        >
          <img
            src={storyData?.author?.profilePicture || dp}
            alt=""
            className="w-full object-cover"
          />
        </div>
        <div
          className="font-semibold text-white pr-6 cursor-pointer"
          onClick={() => {
            navigate(`/profile/${storyData?.author?.username}`);
          }}
        >
          {storyData?.author?.username}
        </div>
      </div>

      <div className="w-full h-[90vh] flex flex-col items-center justify-center">
        {storyData?.mediaType == "image" && (
          <div className="max-w-full h-[100%] flex flex-col items-center justify-center">
            <img
              src={storyData?.media}
              alt="media"
              className="w-full h-[80%] rounded-2xl object-cover"
            />
          </div>
        )}

        {storyData?.mediaType == "video" && (
          <div className="w-full h-[80%] md:h-[500px] flex flex-col items-center justify-center">
            <VideoPlayer media={storyData?.media} />
          </div>
        )}
      </div>

      <div className="absolute top-4 left-0 w-full h-[3px] bg-gray-900">
        <div
          className="h-full bg-white transition-all ease-linear duration-100"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StorySection;

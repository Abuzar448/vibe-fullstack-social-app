import React, { useState, useEffect } from "react";
import dp from "../assets/DP.webp";
import { useSelector } from "react-redux";
import { CiCirclePlus } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StoryCard = ({ profilePicture, username, story }) => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [hasViewedLocally, setHasViewedLocally] = useState(false);

  const checkIfStoryIsViewed = () => {
    if (!story || !story.viewers || !userData?._id) return false;

    return story.viewers.some((viewer) => {
      const viewerId = viewer?._id || viewer;
      return viewerId?.toString() === userData?._id?.toString();
    });
  };

  const isStorySeen = checkIfStoryIsViewed() || hasViewedLocally;

  const handleViewers = async () => {
    try {
      if (story?._id) {
        await axios.get(`http://localhost:8080/api/story/view-story/${story._id}`, { withCredentials: true });
        
        setHasViewedLocally(true);
      }
    } catch (error) {
      console.log("Error updating story view logs:", error);
    }
  };

  const handleClick = () => {
    if (!story && username === 'Your Story') {
      navigate('/upload');
      return;
    }
    if (story) {
       handleViewers();
      
      if (username === 'Your Story') {
        navigate(`/story/${userData?.username}`);
      } else {
        navigate(`/story/${username}`);
      }
    }
  };

  let borderClasses = "border-2 border-black";

  if (story) {
    if (isStorySeen) {
      borderClasses = "border-[2.5px] border-zinc-400/90 opacity-70";
    } else {
      borderClasses = "bg-gradient-to-tr from-blue-500 via-sky-400 to-indigo-900 p-[3px]";
    }
  }

  return (
    <div className="flex flex-col items-center select-none">
      <div
        className={`relative w-[80px] h-[80px] rounded-full flex justify-center items-center cursor-pointer transition-all duration-300 ${borderClasses}`}
        onClick={handleClick}
      >
        <div className="w-full h-full rounded-full border-2 border-black overflow-hidden bg-zinc-950 flex justify-center items-center">
          <img
            src={profilePicture || dp}
            alt={`${username}'s avatar`}
            className="w-full h-full object-cover"
          />
          {!story && username === 'Your Story' && (
            <div className="absolute bottom-0 right-0 text-white font-bold bg-blue-600 rounded-full p-0.5 border border-black">
              <CiCirclePlus size={24}/>
            </div>
          )}
        </div>
      </div>
      
      <div className={`w-[85px] text-[13px] text-center truncate mt-1.5 font-medium transition-colors ${isStorySeen ? "text-zinc-400" : "text-white"}`}>
        {username}
      </div>
    </div>
  );
};

export default StoryCard;
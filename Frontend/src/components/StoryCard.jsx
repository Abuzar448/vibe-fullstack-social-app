import React, { useState, useEffect } from "react";
import dp from "../assets/DP.webp";
import { useSelector } from "react-redux";
import { CiCirclePlus } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StoryCard = ({ profilePicture, username, story }) => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // 🔴 CRITICAL ADDITION 1: Local state jo check karegi ki user ne is render cycle me click kiya ya nahi
  const [hasViewedLocally, setHasViewedLocally] = useState(false);

  // 🔴 CRITICAL ADDITION 2: Ek safe aur foolproof function jo database se aaye viewers array ko check karega
  const checkIfStoryIsViewed = () => {
    if (!story || !story.viewers || !userData?._id) return false;

    // Loop chalakar dekho ki kya login user ki ID viewers list me pehle se hai?
    return story.viewers.some((viewer) => {
      // Baar-baar database me formats badalne par ye crash nahi hone dega
      const viewerId = viewer?._id || viewer;
      return viewerId?.toString() === userData?._id?.toString();
    });
  };

  // Agar user ne database ke mutabik dekh liya hai YA fir abhi-abhi click kiya hai, toh dono case me true hoga
  const isStorySeen = checkIfStoryIsViewed() || hasViewedLocally;

  const handleViewers = async () => {
    try {
      if (story?._id) {
        // Backend ko bataya ki humne story dekh li hai
        await axios.get(`http://localhost:8080/api/story/view-story/${story._id}`, { withCredentials: true });
        
        // 🔴 CRITICAL ADDITION 3: Backend response confirm hote hi frontend state ko true kar do
        setHasViewedLocally(true);
      }
    } catch (error) {
      console.log("Error updating story view logs:", error);
    }
  };

  const handleClick = async () => {
    if (!story && username === 'Your Story') {
      navigate('/upload');
      return;
    }

    if (story) {
      // Pehle backend ka wait karo aur view state badlo, phir navigate karo
      await handleViewers();
      
      if (username === 'Your Story') {
        navigate(`/story/${userData?.username}`);
      } else {
        navigate(`/story/${username}`);
      }
    }
  };

  // 🔴 CRITICAL ADDITION 4: Dynamic Border Logic Styling Classes
  let borderClasses = "border-2 border-black"; // Agar koi story nahi hai

  if (story) {
    if (isStorySeen) {
      // Agar story dekh li hai -> Subtle aur clean Gray color (Jaise baki social apps me hota hai)
      borderClasses = "border-[2.5px] border-zinc-400/90 opacity-70";
    } else {
      // Agar story nahi dekhi hai -> Radiant Blue Gradient Outer Rim
      borderClasses = "bg-gradient-to-tr from-blue-500 via-sky-400 to-indigo-900 p-[3px]";
    }
  }

  return (
    <div className="flex flex-col items-center select-none">
      {/* Outer Circle Ring */}
      <div
        className={`relative w-[80px] h-[80px] rounded-full flex justify-center items-center cursor-pointer transition-all duration-300 ${borderClasses}`}
        onClick={handleClick}
      >
        {/* Inner Image Frame to protect image from squeezing */}
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
      
      {/* Username with smart grayed-out state if viewed */}
      <div className={`w-[85px] text-[13px] text-center truncate mt-1.5 font-medium transition-colors ${isStorySeen ? "text-zinc-400" : "text-white"}`}>
        {username}
      </div>
    </div>
  );
};

export default StoryCard;
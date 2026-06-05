import React from "react";
import dp from "../assets/DP.webp";
import { useSelector } from "react-redux";
import { CiCirclePlus } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const StoryCard = ({ profilePicture, username, story }) => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleClick = ()=>{
    if(!story && username=='Your Story'){
      navigate('/upload')
    }
    else if(story && username=='Your Story'){
      navigate(`/story/${userData?.username}`)
    }
    else if(story && username!=='Your Story'){
      navigate(`/story/${username}`)
    }
  }
  return (
    <div>
      <div
        className={`relative w-[80px] h-[80px] ${story ? "bg-gradient-to-b from-blue-500 to-blue-950" : "border-2 border-black "} rounded-full flex justify-center items-center `}
        onClick={handleClick}
      >
        <div className="w-[70px] h-[70px] rounded-full border-2 border-black cursor-pointer overflow-hidden ">
          <img
            src={profilePicture || dp}
            alt=""
            className="w-full object-cover"
          />
          {!story && username=='Your Story' && <div className="absolute bottom-0 right-0 text-white font-bold"><CiCirclePlus size={30}/></div>}
        </div>
      </div>
      <div className="w-full text-[14px] text-center truncate text-white">
        {username}
      </div>
    </div>
  );
};

export default StoryCard;

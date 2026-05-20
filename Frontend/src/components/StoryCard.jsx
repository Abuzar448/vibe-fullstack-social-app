import React from "react";
import dp from "../assets/DP.webp";
import { useSelector } from "react-redux";

const StoryCard = ({ profilePicture, username }) => {
  const { userData } = useSelector((state) => state.user);
  return (
    <div>
      <div className="w-[80px] h-[80px] bg-gradient-to-b from-blue-500 to-blue-950 rounded-full flex justify-center items-center">
        <div className="w-[70px] h-[70px] rounded-full border-2 border-black cursor-pointer overflow-hidden ">
          <img
            src={userData.profilePicture || dp}
            alt=""
            className="w-full object-cover"
          />
        </div>
      </div>
      <div className="text-[14px] text-center truncate w-[90%] text-white">
        {userData.username}
      </div>
    </div>
  );
};

export default StoryCard;

import React from "react";
import dp from '../assets/DP.webp'
import { useNavigate } from "react-router-dom";
import FollowBtn from "./FollowBtn";

const OtherUser = ({user}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-[80px] flex items-center justify-between border-b-2 border-gray-800">
      <div className="flex h-[100px] items-center w-full justify-between gap-[10px] px-[4px] py-[15px]">
        <div className="h-full flex items-center gap-[10px]">
          <div className="w-[50px] h-[50px] rounded-full border-2 border-black cursor-pointer overflow-hidden" onClick={()=>{
            navigate(`/profile/${user.username}`)
          }}>
            <img
              src={user.profilePicture || dp}
              alt=""
              className="w-full object-cover"
            />
          </div>
          <div className="cursor-pointer" onClick={()=>{navigate(`/profile/${user.username}`)}}>
            <div className="text-[18px] text-white font-semibold truncate">
              {user.username}
            </div>
            <div className="text-[16px] text-gray-400  font-semibold">
              {user.name}
            </div>
          </div>
        </div>
      </div>
      <FollowBtn tailwind={'px-[10px] w-[100px] text-black py-[5px] h-[40px] bg-white rounded-2xl font-semibold cursor-pointer'} targetUserId={user._id}></FollowBtn>
    </div>
  );
};

export default OtherUser;

import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedUser } from "../redux/messageSlice";
import dp from "../assets/DP.webp";

const OnlineUser = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="w-[50px] h-[50px] flex gap-[20px] justify-start items-center relative">
      <div className="h-full flex items-center gap-[10px]">
        <div
          className="w-[50px] h-[50px] rounded-full border-2 border-black cursor-pointer overflow-hidden"
          onClick={() => {
            dispatch(setSelectedUser(user));
            navigate("/messageArea");
          }}
        >
          <img
            src={user.profilePicture || dp}
            alt=""
            className="w-full object-cover"
          />
        </div>
        <div
          className="cursor-pointer"
          onClick={() => {
            navigate(`/profile/${user.username}`);
          }}
        >
          <div className="text-[18px] text-white font-semibold truncate">
            {user.username}
          </div>
          <div className="text-[14px] text-[#0080ff]  font-semibold">
            Active Now
          </div>
        </div>
        <div className="w-[12px] h-[12px] bg-[#0080ff] rounded-full absolute top-1 right-0"></div>
      </div>
    </div>
  );
};

export default OnlineUser;

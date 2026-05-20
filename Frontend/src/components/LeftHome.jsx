import React from "react";
import logo2 from "../assets/logo2.png";
import { FaRegHeart } from "react-icons/fa6";
import dp from "../assets/DP.webp";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import OtherUser from "./OtherUser";

const LeftHome = () => {
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    try {
      const result = await axios.get("http://localhost:8080/api/auth/signout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  const { userData, suggestedUsers } = useSelector((state) => state.user);

  return (
    <div className="w-[25%] hidden lg:block min-h-[100vh] bg-[black] border-r-2 border-gray-900">
      <div className="flex justify-between w-full h-[100px] items-center p-[20px]">
        <img src={logo2} alt="" className="w-[90px]" />
        <div>
          <FaRegHeart size={25} color="white" />
        </div>
      </div>

      <div className="flex h-[100px] items-center w-full justify-between gap-[10px] px-[4px] border-b-2 border-b-gray-900 py-[10px]">
        <div className="h-full flex items-center gap-[10px]">
          <div className="w-[70px] h-[70px] rounded-full border-2 border-black cursor-pointer overflow-hidden">
            <img
              src={userData.profilePicture || dp}
              alt=""
              className="w-full object-cover"
            />
          </div>
          <div>
            <div className="text-[18px] text-white font-semibold">
              {userData.username}
            </div>
            <div className="text-[16px] text-gray-400  font-semibold">
              {userData.name}
            </div>
          </div>
        </div>
        <div
          className="text-blue-700 font-semibold cursor-pointer"
          onClick={handleLogOut}
        >
          Log Out
        </div>
      </div>

      <div className="w-full flex flex-col gap-[20px] p-[8px]">
        <h1 className="text-white text-[19px] font-semibold">
          Suggested Users
        </h1>
        {suggestedUsers &&
          suggestedUsers
            .slice(0, 5)
            .map((user, idx) => <OtherUser key={idx} user={user} />)}
      </div>
    </div>
  );
};

export default LeftHome;
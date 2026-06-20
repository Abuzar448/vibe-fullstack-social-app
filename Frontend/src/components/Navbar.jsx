import React from "react";
import { MdHome } from "react-icons/md";
import { ImSearch } from "react-icons/im";
import { RxVideo } from "react-icons/rx";
import { FaRegPlusSquare } from "react-icons/fa";


import dp from "../assets/DP.webp";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  return (
    <div className="w-[90%] lg:w-[40%] h-[70px] bg-black flex justify-evenly  items-center fixed bottom-[20px] rounded-full shadow-2xl shadow-[#000000] z-[100]">
      <div className="w-[25px] h-[25px] cursor-pointer" onClick={() => navigate('/')}>
        <MdHome color="white" className="w-full h-full" />
      </div>
      <div className="w-[25px] h-[25px] cursor-pointer" onClick={() => navigate('/search')}>
        <IoMdSearch color="white" className="w-full h-full" />
      </div>
      <div onClick={()=>navigate('/upload')} className="w-[30px] h-[30px] cursor-pointer">
        <IoMdAdd color="white" className="w-full h-full" />
      </div>
      <div onClick={()=>navigate('/reels')} className="w-[25px] h-[25px] cursor-pointer">
        <RxVideo color="white" className="w-full h-full" />
      </div>
      

      <div className="w-[35px] h-[35px] rounded-full border-2 border-black cursor-pointer overflow-hidden" onClick={()=>{
        navigate(`/profile/${userData.username}`)
      }}>
        <img
          src={userData.profilePicture || dp}
          alt=""
          className="w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Navbar;

import React from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ReelCard from "../components/ReelCard";
import { useSelector } from "react-redux";

const Reel = () => {
  const navigate = useNavigate();
  const { loopData } = useSelector((state) => state.loop);
  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center overflow-hidden select-none">
      <div className="w-full max-w-[480px] h-[80px] flex items-center gap-[20px] px-[20px] fixed left-[10px] top-[20px] z-100">
        <MdOutlineKeyboardBackspace
          className="text-white cursor-pointer w-[30px] h-[30px]  hover:scale-110 transition-transform duration-200"
          onClick={() => navigate(-1)} // Safe navigation
        />
        <h1 className="text-white text-[22px] font-semibold tracking-wide">Loops</h1>
      </div>
      <div className="w-full h-full max-w-[480px] overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar" style={{
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none', 
        }}>
          <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {loopData?.map((loop, idx) => (
          <div className="w-full h-screen snap-start snap-always flex items-center justify-center bg-zinc-950">
            <ReelCard loop={loop} key={loop?._id || idx}></ReelCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reel;

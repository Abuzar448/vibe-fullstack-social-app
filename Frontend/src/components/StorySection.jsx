import React, { useEffect, useState } from "react";
import dp from "../assets/DP.webp";
import { useSelector } from "react-redux";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import { IoIosEye } from "react-icons/io";
import { IoClose } from "react-icons/io5";

const StorySection = ({ storyData }) => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  
  const [showViewers, setShowViewers] = useState(false);
  const [progress, setProgress] = useState(0);

  const viewersCount = storyData?.viewers?.length || 0;
  const isAuthor = storyData?.author?.username === userData?.username;

  // --- SMARTER TIMELINE AUTOPLAY FUNCTIONALITY ---
  useEffect(() => {
    // Agar viewers modal open hai, toh timeline ko yahi par rok do (Pause state)
    if (showViewers) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate("/"); // Story khatam hone par home page par redirect
          return 100;
        }
        return prev + 1;
      });
    }, 60); // Total 6 seconds story duration (60ms * 100)

    return () => clearInterval(interval);
  }, [navigate, showViewers]); // Triggers again whenever showViewers state changes

  return (
    <div className="w-full max-w-[500px] h-screen border-x border-zinc-800 relative flex flex-col justify-between bg-zinc-950 select-none overflow-hidden font-sans">
      
      {/* Top Segmented Progress Bar */}
      <div className="absolute top-3 left-0 w-full px-3 z-40 flex gap-1">
        <div className="w-full h-[3px] bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all ease-linear duration-75"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Header Section with Smooth Gradient Mask */}
      <div className="w-full flex items-center gap-3 px-4 pt-8 pb-6 absolute top-0 left-0 z-30 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <button 
          className="p-1 rounded-full hover:bg-white/10 active:scale-95 transition text-white"
          onClick={() => navigate("/")}
          aria-label="Back"
        >
          <IoArrowBackOutline className="w-6 h-6 cursor-pointer" />
        </button>
        
        <div
          className="w-10 h-10 rounded-full border border-zinc-700 cursor-pointer overflow-hidden active:opacity-80 transition-opacity"
          onClick={() => navigate(`/profile/${storyData?.author?.username}`)}
        >
          <img
            src={storyData?.author?.profilePicture || dp}
            alt="Author Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        
        <span
          className="font-medium text-sm text-white cursor-pointer hover:underline truncate"
          onClick={() => navigate(`/profile/${storyData?.author?.username}`)}
        >
          {storyData?.author?.username || "Loading..."}
        </span>
      </div>

      {/* Main Media Core Viewport */}
      <div className="w-full h-full flex items-center justify-center bg-black px-1">
        {storyData?.mediaType === "image" && (
          <img
            src={storyData?.media}
            alt="Story content"
            className="w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
          />
        )}

        {storyData?.mediaType === "video" && (
          <div className="w-[60%] max-h-[85vh] rounded-xl overflow-hidden shadow-2xl">
            <VideoPlayer media={storyData?.media} />
          </div>
        )}
      </div>

      {isAuthor && (
        <div className="w-full h-[75px] border-t border-zinc-900 px-5 absolute bottom-0 left-0 flex items-center justify-between text-white bg-zinc-950/90 backdrop-blur-md z-20">
          <button 
            className="flex items-center gap-2 hover:text-zinc-300 transition group cursor-pointer"
            onClick={() => setShowViewers(true)}
          >
            <IoIosEye size={26} className="text-zinc-400 group-hover:text-white transition-colors cursor-pointer" />
            <span className="font-medium text-sm tracking-wide cursor-pointer">{viewersCount} views</span>
          </button>
          
          {viewersCount > 0 && (
            <div 
              className="flex relative h-9 items-center cursor-pointer" 
              style={{ width: `${Math.min(viewersCount, 3) * 16 + 16}px` }}
              onClick={() => setShowViewers(true)}
            >
              {storyData?.viewers?.slice(0, 3).map((viewer, idx) => (
                <div
                  key={viewer?._id || idx}
                  className="w-8 h-8 rounded-full border-2 border-zinc-950 overflow-hidden absolute shadow-md"
                  style={{
                    left: `${idx * 16}px`,
                    zIndex: 10 - idx,
                  }}
                >
                  <img
                    src={viewer?.profilePicture || dp}
                    alt="Viewer thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showViewers && (
        <>
          <div 
            className="absolute inset-0 bg-black/50 z-40 transition-opacity backdrop-blur-sm animate-fade-in"
            onClick={() => setShowViewers(false)}
          />
          
          <div className="w-full h-[55%] absolute bottom-0 left-0 border-t border-zinc-800 flex flex-col text-white z-50 bg-zinc-900 rounded-t-2xl shadow-2xl transition-all duration-300 transform translate-y-0">

            <div className="w-full py-3 px-4 border-b border-zinc-800/60 flex justify-between items-center bg-zinc-900 rounded-t-2xl ">
              <div className="flex flex-col ">
                <span className="font-semibold text-sm tracking-wide text-zinc-100">Views</span>
                <span className="text-xs text-zinc-400 font-light">{viewersCount} accounts have viewed</span>
              </div>
              <button 
                className="p-1 rounded-full bg-zinc-800 hover:bg-zinc-700 active:scale-95 transition text-zinc-300"
                onClick={() => setShowViewers(false)}
              >
                <IoClose size={20} className="cursor-pointer"/>
              </button>
            </div>

            {/* Scrollable Viewers List */}
            <div className="w-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] flex-1 bg-zinc-900">
              {storyData?.viewers && storyData.viewers.length > 0 ? (
                storyData.viewers.map((viewer, idx) => (
                  <div 
                    key={viewer?._id || idx} 
                    className="w-full h-[64px] flex items-center justify-between p-4 border-b border-zinc-800/40 hover:bg-zinc-800/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/profile/${viewer?.username}`)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={viewer?.profilePicture || dp} 
                        alt="Viewer Identity" 
                        className="w-10 h-10 rounded-full object-cover border border-zinc-800 flex-shrink-0" 
                      />
                      <span className="font-medium text-sm text-zinc-200 truncate">
                        {viewer?.username || "Unknown User"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 py-12 gap-2">
                  <IoIosEye size={36} className="text-zinc-600" />
                  <span className="text-xs tracking-wider font-light">No views yet</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StorySection;
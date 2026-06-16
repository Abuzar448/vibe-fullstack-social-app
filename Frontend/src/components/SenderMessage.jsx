import React, { memo } from "react";
import { useSelector } from "react-redux";
import dp from "../assets/DP.webp"; // Default profile picture fallback
import { useRef } from "react";
import { useEffect } from "react";

const SenderMessage = ({ message }) => {
  // Redux store se user state handle ki
  const { userData } = useSelector((state) => state.user);
  const scroll = useRef();
  useEffect(() => {
    scroll.current.scrollIntoView({behaviour:'smooth'})
  }, [message.message,message.image]);

  if (!message) return null;

  return (
    <div ref={scroll} className="flex items-end gap-3 w-full max-w-[75%] md:max-w-[60%] ml-auto mb-4 justify-end group">
      
      {/* 1. Message Bubble Container */}
      <div className="flex flex-col gap-1.5 bg-gradient-to-br from-[#9500ff] to-[#ff0095] rounded-2xl rounded-br-none px-4 py-3 shadow-md relative max-w-full overflow-hidden">
        
        {/* 2. Image Attachment Element */}
        {message.image && (
          <div className="relative rounded-xl overflow-hidden max-w-full bg-black/20 cursor-pointer">
            <img
              src={message.image}
              alt="Sent attachment"
              className="max-h-[300px] w-auto max-w-full object-contain mx-auto transition-transform duration-300 hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        )}

        {/* 3. Text Message Area */}
        {message.message && (
          <div className="text-[15px] leading-relaxed text-white break-words whitespace-pre-wrap selection:bg-black selection:text-white">
            {message.message}
          </div>
        )}

        {/* 4. Chat Timestamp */}
        {message.createdAt && (
          <span className="text-[10px] text-white/70 self-end mt-1 font-medium tracking-wide block">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {/* 5. Avatar (Cleaned flex alignment instead of absolute glitch positioning) */}
      <div className="w-8 h-8 rounded-full cursor-pointer overflow-hidden flex-shrink-0 border border-purple-900 shadow-sm transition-transform hover:scale-105">
        <img
          src={userData?.profilePicture || dp}
          alt="Your avatar"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

    </div>
  );
};

// Optimization: heavy charts me un-necessary state triggers se component re-render ko rokega
export default memo(SenderMessage);
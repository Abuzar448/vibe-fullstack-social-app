import React, { memo } from 'react';
import { useSelector } from "react-redux";
import dp from "../assets/DP.webp"; 

const RecieverMessage = ({ message }) => {
  const { selectedUser } = useSelector((state) => state.message);

  if (!message) return null;

  return (
    // FIX: Hatayi gayi bekar ki overflow aur scroll classes jo layout ko crash kar rahi thi
    <div className="flex items-end gap-3 w-full max-w-[75%] md:max-w-[60%] mr-auto mb-4 group">
      
      {/* 1. Avatar */}
      <div className="w-8 h-8 rounded-full cursor-pointer overflow-hidden flex-shrink-0 border border-gray-800 shadow-sm transition-transform hover:scale-105">
        <img 
          src={selectedUser?.profilePicture || dp} 
          alt={`${selectedUser?.username || 'user'}'s avatar`} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* 2. Message Bubble Container */}
      <div className="flex flex-col gap-1.5 bg-[#262626] border border-zinc-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-md relative group-hover:bg-[#2e2e2e] transition-colors duration-200 min-w-0">
        
        {/* 3. Image Component */}
        {message.image && (
          <div className="relative rounded-xl overflow-hidden max-w-full border border-zinc-700/50 bg-zinc-900 cursor-pointer">
            <img
              src={message.image}
              alt="Sent attachment"
              className="max-h-[300px] w-auto max-w-full object-contain mx-auto transition-transform duration-300 hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        )}

        {/* 4. Chat Text Content */}
        {message.message && (
          // OPTIMIZATION: Agar text area me scrollbar hide karna hi hai, toh use yahan apply karein max-height ke saath
          <div className="text-[15px] leading-relaxed text-zinc-100 break-words whitespace-pre-wrap selection:bg-emerald-500 selection:text-black max-h-[400px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {message.message}
          </div>
        )}

        {/* 5. Timestamp */}
        {message.createdAt && (
          <span className="text-[10px] text-zinc-500 self-end mt-1 font-medium tracking-wide block">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
};

export default memo(RecieverMessage);
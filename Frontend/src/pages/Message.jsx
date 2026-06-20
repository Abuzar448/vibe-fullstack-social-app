import React, { useMemo } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OnlineUser from "../components/OnlineUser";
import { setSelectedUser } from "../redux/messageSlice";
import dp from "../assets/dp.webp";

const Message = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { userData } = useSelector((state) => state.user);
  const { onlineUsers } = useSelector((state) => state.socket);
  const { previousChatUsers } = useSelector((state) => state.message);

  // 1. Convert onlineUsers array to a Set for O(1) ultra-fast lookup
  const onlineUsersSet = useMemo(() => new Set(onlineUsers || []), [onlineUsers]);

  // 2. Filter online following list efficiently
  const activeFollowing = useMemo(() => {
    return userData?.following?.filter((user) => onlineUsersSet.has(user?._id)) || [];
  }, [userData?.following, onlineUsersSet]);

  const handleUserClick = (user) => {
    dispatch(setSelectedUser(user));
    navigate(`/messageArea`);
  };

  return (
    <div className="w-full min-h-screen bg-black text-zinc-100 flex flex-col antialiased selection:bg-zinc-800">
      
      {/* Top Header Section */}
      <div className="w-full h-16 flex items-center gap-4 px-6 border-b border-zinc-900 sticky top-0 bg-zinc-950/80 backdrop-blur-md z-10">
        <button 
          onClick={() => navigate(-1)}
          className="p-1 rounded-full hover:bg-zinc-900 transition-colors md:hidden text-zinc-400 hover:text-zinc-100"
          aria-label="Go back"
        >
          <MdOutlineKeyboardBackspace className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          Messages
        </h1>
      </div>

      {/* Online Users Section (Horizontal Slider) */}
      {activeFollowing.length > 0 && (
        <div className="w-full flex flex-col pt-4 pb-2 border-b border-zinc-900/60">
          <div className="px-6 mb-2">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Online Users ({activeFollowing.length})
            </h2>
          </div>
          <div className="w-full flex gap-4 justify-start items-center overflow-x-auto px-6 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {activeFollowing.map((user, idx) => (
              <div key={user?._id || idx} className="transform hover:scale-105 transition-transform duration-200">
                <OnlineUser user={user} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Previous Chats Section */}
      <div className="flex-1 flex flex-col px-4 pt-4">
        <div className="px-2 mb-3">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Recent Conversations
          </h2>
        </div>

        <div className="w-full flex flex-col gap-1 overflow-y-auto">
          {previousChatUsers && previousChatUsers.length > 0 ? (
            previousChatUsers.map((user, idx) => {
              const isOnline = onlineUsersSet.has(user?._id);
              
              return (
                <div
                  key={user?._id || idx}
                  onClick={() => handleUserClick(user)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-900/60 active:bg-zinc-900 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Profile Picture with Absolute Premium Status Dot */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full ring-1 ring-zinc-800 overflow-hidden bg-zinc-900">
                        <img
                          src={user?.profilePicture || dp}
                          alt={`${user?.username || 'user'}'s profile`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      {/* Premium Green Ring Indicator if Online */}
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-zinc-950 animate-pulse" />
                      )}
                    </div>

                    {/* Meta Data */}
                    <div className="min-w-0 flex flex-col">
                      <span className="text-sm font-semibold text-zinc-200 group-hover:text-zinc-100 transition-colors truncate">
                        {user?.username || "Anonymous User"}
                      </span>
                      <span className="text-xs text-zinc-500 truncate">
                        {isOnline ? "Active now" : "Offline"}
                      </span>
                    </div>
                  </div>

                  {/* Aesthetic subtle action pointer */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-zinc-500 pr-2 hidden sm:block">
                    Open Chat →
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full py-20 flex flex-col items-center justify-center text-zinc-600 gap-2">
              <p className="text-sm">No recent conversations yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
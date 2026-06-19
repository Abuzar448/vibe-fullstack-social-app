import React from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OnlineUser from "../components/OnlineUser";
import { setSelectedUser } from "../redux/messageSlice";

const Message = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { onlineUsers } = useSelector((state) => state.socket);
  const { previousChatUsers } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  return (
    <div className="w-full min-h-[100vh] flex flex-col bg-black gap-[20px] px-[20px]">
      {/* back arrow and title */}
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px]">
        <MdOutlineKeyboardBackspace
          className="text-white cursor-pointer w-[25px] h-[25px] md:hidden"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-white text-[20px] font-semibold">Messages</h1>
      </div>
      <div className="w-full h-[80px] flex gap-[20px] justify-start items-center overflow-x-auto p-[20px] border-b-2 border-gray-800">
        {userData?.following?.map(
          (user, idx) =>
            onlineUsers?.includes(user._id) && (
              <OnlineUser user={user}></OnlineUser>
            ),
        )}
      </div>

      <div className="w-full h-full overflow-auto flex flex-col gap-[20px]">
        {previousChatUsers?.map((user, idx) => (
          <div
            onClick={() => {
              dispatch(setSelectedUser(user));
              navigate(`/messageArea`);
            }}
            className="text-white cursor-pointer w-full flex items-center gap-[10px]"
          >
            {onlineUsers.includes(user._id) ? (
              <OnlineUser user={user}></OnlineUser>
            ) : (
              <div className="h-full flex items-center gap-[10px]">
                        <div className="w-[50px] h-[50px] rounded-full border-2 border-black cursor-pointer overflow-hidden" onClick={()=>{
                          navigate(`/messageArea`)
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
                        </div>
                      </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Message;

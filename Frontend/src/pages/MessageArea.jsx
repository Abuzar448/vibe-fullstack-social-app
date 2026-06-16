import React from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dp from "../assets/DP.webp";
import { setSelectedUser } from "../redux/messageSlice";
import { FaImages } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import SenderMessage from "../components/SenderMessage";
import { useState } from "react";
import { useRef } from "react";

const MessageArea = () => {
  const { selectedUser } = useSelector((state) => state.message);
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const imageinput = useRef(null);
  const [frontEndImage, setFrontEndImage] = useState(null);
  const [backEndImage, setBackEndImage] = useState(null);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    setBackEndImage(file);
    setFrontEndImage(URL.createObjectURL(file));
  };

  return (
    <div className="w-full bg-black h-[100vh] relative">
      {/* top div with user details */}
      <div className="flex items-center gap-[15px] px-[22px] py-[20px] fixed top-0 z-[100] bg-black w-full">
        {/* back arrow */}
        <div>
          <MdOutlineKeyboardBackspace
            className="text-white cursor-pointer w-[25px] h-[25px]"
            onClick={() => navigate(-1)}
          />
        </div>
        {/* profilePicture */}
        <div>
          <div className="w-[50px] h-[50px] rounded-full border-2 border-black cursor-pointer overflow-hidden">
            <img
              src={selectedUser?.profilePicture || dp}
              alt=""
              className="w-full object-cover"
            />
          </div>
        </div>
        {/* username and name  */}
        <div className="text-white font-semibold flex flex-col">
          <div className="text-[18px]">{selectedUser?.username}</div>
          <div className="text-[14px] text-gray-300">{selectedUser?.name}</div>
        </div>
      </div>
      {/* div which prints all the messages */}
      <div className="w-full h-[80%] pt-[100px] pb-[120px] lg:pb-[150px] px-[40px] flex flex-col gap-[50px] overflow-auto bg-black"></div>
      {/* input in form */}
      <div className="w-full h-[80px] fixed bottom-0 flex justify-center items-center bg-black z-[100]">
        <form className="w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#131616] flex items-center gap-[10px] px-[20px] relative">
          {frontEndImage && (
            <div className="w-[100px] h-[100px] rounded absolute top-[-120px] right-[10px] overflow-hidden border-1 border-gray-800">
              <img src={frontEndImage} alt="" className="w-full h-full object-cover"/>
            </div>
          )}

          <input
            type="text"
            placeholder="Message"
            className="w-full h-full px-[20px] text-[18px] text-white outline-0"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <div className="flex gap-[25px]">
            <input
              type="file"
              accept="image/*"
              ref={imageinput}
              hidden
              onChange={handleImage}
            />
            <div onClick={() => imageinput.current.click()}>
              <FaImages className="w-[25px] h-[25px] text-white cursor-pointer" />
            </div>
            {(input || frontEndImage) && (
              <button type="submit">
                <IoSend className="w-[25px] h-[25px] text-white cursor-pointer" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageArea;

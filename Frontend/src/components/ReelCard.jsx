import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaVolumeMute } from "react-icons/fa";
import { VscUnmute } from "react-icons/vsc";
import dp from "../assets/DP.webp";
import FollowBtn from "./FollowBtn";
import { useNavigate } from "react-router-dom";
import { GoFoldDown, GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import { MdOutlineMessage } from "react-icons/md";
import { RiBookmarkLine } from "react-icons/ri";
import { RiBookmarkFill } from "react-icons/ri";
import { setLoopData } from "../redux/loopSlice";
import { IoSendSharp } from "react-icons/io5";
import axios from "axios";

const ReelCard = ({ loop, idx }) => {
  const videoRef = useRef();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMute, setIsMute] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showComments, setShowComments] = useState(false);
  const [message, setMessage] = useState();
  const [showHeart, setShowHeart] = useState(false);

  const { userData } = useSelector((state) => state.user);
  const { loopData } = useSelector((state) => state.loop);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (entry.isIntersecting) {
          video.play();
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 },
    );
    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      const percent = (video.currentTime / video.duration) * 100;
      setProgress(percent);
    }
  };

  const handleLike = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8080/api/reel/like-reel/${loop._id}`,
        { withCredentials: true },
      );
      const updatedLoop = result.data;
      const updatedLoops = loopData.map((l) =>
        l._id == loop._id ? updatedLoop : l,
      );
      dispatch(setLoopData(updatedLoops));
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikeOnDoubleClick = () => {
    setShowHeart(true);
    setTimeout(() => {
      setShowHeart(false);
    }, 6000);
    if (!loop.likes?.includes(userData?._id)) {
      handleLike();
    }
  };

  const handleComment = async () => {
    try {
      const result = await axios.post(
        `http://localhost:8080/api/reel/comment-reel/${loop._id}`,
        { message },
        { withCredentials: true },
      );
      const updatedLoop = result.data;

      const updatedLoops = loopData.map((l) =>
        l._id == loop._id ? updatedLoop : l,
      );
      dispatch(setLoopData(updatedLoops));
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full lg:h-[95vh] lg:max-h-[850px] lg:rounded-xl flex items-center justify-center border-zinc-800/80 lg:border relative overflow-hidden bg-black shadow-2xl">
      {showHeart && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] z-50 pointer-events-none drop-shadow-2xl heart-animation">
          <GoHeartFill className="w-full h-full text-red-600" />
        </div>
      )}

      <video
        autoPlay
        loop
        muted={isMute}
        playsInline
        ref={videoRef}
        src={loop?.media}
        className="w-full h-full object-cover md:object-contain"
        onClick={handleClick}
        onTimeUpdate={handleTimeUpdate}
        onDoubleClick={handleLikeOnDoubleClick}
      />
      <div className="absolute right-2 top-15">
        {!isMute ? (
          <FaVolumeMute
            className="absolute w-[25px] h-[25px] bottom-2 right-2 text-[white] cursor-pointer"
            onClick={() => setIsMute(true)}
          />
        ) : (
          <VscUnmute
            className="absolute w-[25px] h-[25px] bottom-2 right-2 text-[white] cursor-pointer"
            onClick={() => setIsMute(false)}
          />
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gray-900">
        <div
          className="h-full bg-white transition-all ease-linear duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="w-full absolute h-[100px] bottom-[10px]">
        <div className="flex w-[100%] items-center gap-[8px] px-[20px]">
          <div
            className="w-[50px] h-[50px] md:w-[40px] md:h-[40px] rounded-full border-1 border-black cursor-pointer overflow-hidden"
            onClick={() => {
              navigate(`/profile/${loop.author?.username}`);
            }}
          >
            <img
              src={loop.author?.profilePicture || dp}
              alt=""
              className="w-full object-cover"
            />
          </div>
          <div
            className="font-semibold text-white pr-6 cursor-pointer"
            onClick={() => {
              navigate(`/profile/${loop.author?.username}`);
            }}
          >
            {loop.author?.username}
          </div>
          <FollowBtn
            targetUserId={loop.author?._id}
            tailwind={
              "px-[10px] py-[5px] text-white border-2 border-white rounded-xl cursor-pointer"
            }
          ></FollowBtn>
        </div>
        <div className="flex flex-wrap w-[100%] items-center gap-[8px] px-[25px] p-3">
          <div className="text-white">{loop?.caption}</div>
        </div>

        <div className="absolute right-0 flex flex-col gap-[20px] text-white bottom-[150px] justify-center px-[20px]">
          {/* like */}
          <div className="flex flex-col items-center cursor-pointer">
            <div>
              {!loop?.likes?.includes(userData._id) && (
                <GoHeart
                  size={20}
                  className="cursor-pointer"
                  onClick={handleLike}
                />
              )}
              {loop?.likes.includes(userData._id) && (
                <GoHeartFill
                  size={25}
                  className="cursor-pointer text-red-600"
                  onClick={handleLike}
                />
              )}
            </div>
            <div>{loop.likes.length}</div>
          </div>
          {/* comment */}
          <div className="flex flex-col items-center cursor-pointer">
            <div>
              <MdOutlineMessage
                size={20}
                className="cursor-pointer"
                onClick={() => setShowComments(true)}
              />
            </div>
            <div>{loop.comments?.length}</div>
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <div>
              {userData?.saved?.includes(loop?._id) ? (
                <RiBookmarkFill size={20} className="cursor-pointer" />
              ) : (
                <RiBookmarkLine size={20} className="cursor-pointer" />
              )}
            </div>
            <div></div>
          </div>
        </div>
      </div>

      {showComments && (
        <div
          style={{ animation: 'slideUpCommentsPanel 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards' }}
          className="absolute bottom-0 left-0 w-full bg-gray-900 border-t border-gray-700 rounded-t-2xl p-[20px] h-[60vh] flex flex-col z-50 shadow-2xl overflow-hidden"
        >
          {/* Comment Input Section (Fixed Top) */}
          <div className="flex w-full justify-between h-[60px] items-center px-[10px] sm:px-[20px] shrink-0 border-b border-gray-800">
            <div className="w-[35px] h-[35px] md:w-[45px] md:h-[45px] rounded-full border border-gray-600 cursor-pointer overflow-hidden shrink-0">
              <img
                src={loop.author?.profilePicture || dp}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="text"
              className="px-[15px] bg-gray-800 text-white rounded-full w-[75%] outline-none h-[40px] text-sm border border-transparent focus:border-gray-600 transition-all"
              placeholder="Write comment..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <button
              onClick={handleComment}
              className="text-blue-500 hover:text-blue-400 transition-colors"
            >
              <IoSendSharp size={22} className="cursor-pointer" />
            </button>
          </div>

          {/* Close Button & Scrollable Comments Area */}
          <div className="w-full flex-1 flex flex-col overflow-y-auto mt-2 px-[10px] sm:px-[20px] custom-scrollbar">
            <div
              className="flex items-center justify-center cursor-pointer py-2 sticky top-0 bg-gray-900 z-10 text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowComments(false)}
            >
              <GoFoldDown size={30} />
            </div>

            <div className="flex flex-col gap-4 pb-4">
              {loop?.comments?.length > 0 ? (
                loop.comments
                  .slice()
                  .reverse()
                  .map((item, index) => (
                    <div
                      key={item._id || index}
                      className="flex items-start gap-3 bg-gray-800/40 p-3 rounded-xl border border-gray-800"
                    >
                      <img
                        src={item.author?.profilePicture || dp}
                        className="w-[36px] h-[36px] rounded-full object-cover border border-gray-700 shrink-0"
                        alt="author"
                      />
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="text-[13px] text-gray-200 break-words">
                          <span className="font-bold text-white mr-2">
                            {item.author?.username}
                          </span>
                          <span className="text-gray-300">{item.message}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">
                  No comments yet...
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReelCard;

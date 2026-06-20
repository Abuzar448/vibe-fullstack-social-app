import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/DP.webp";
import VideoPlayer from "./VideoPlayer";
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import { CiSaveDown1 } from "react-icons/ci";
import { MdOutlineMessage } from "react-icons/md";
import { RiBookmarkLine } from "react-icons/ri";
import { RiBookmarkFill } from "react-icons/ri";
import { IoSendSharp } from "react-icons/io5";
import { setPostData } from "../redux/postSlice";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import { GoFoldUp } from "react-icons/go";
import FollowBtn from "./FollowBtn";
import { useNavigate } from "react-router-dom";

const Post = ({ post }) => {
  const { userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const { socket } = useSelector((state) => state.socket);
  const [showComments, setShowComments] = useState(false);
  const [message, setMessage] = useState();
  const [followbtn, setFollowbtn] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLike = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8080/api/post/like-post/${post._id}`,
        { withCredentials: true },
      );
      const updatedPost = result.data;
      const updatedPosts = postData.map((p) =>
        p._id == post._id ? updatedPost : p,
      );
      dispatch(setPostData(updatedPosts));
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async () => {
    try {
      const result = await axios.post(
        `http://localhost:8080/api/post/comment-post/${post._id}`,
        { message },
        { withCredentials: true },
      );
      const updatedPost = result.data;

      const updatedPosts = postData.map((p) =>
        p._id == post._id ? updatedPost : p,
      );
      dispatch(setPostData(updatedPosts));
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSavePost = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8080/api/post/save-post/${post._id}`,
        { withCredentials: true },
      );
      console.log(result.data);
      dispatch(setUserData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket?.on('likedPost',(updatedData)=>{
      const updatedPosts = postData.map((p) =>
        p._id == updatedData.postId ? {...p,likes:updatedData.likes} : p,
      );
      dispatch(setPostData(updatedPosts));
    })

    socket?.on('commentedPost',(updatedData)=>{
      const updatedPosts = postData.map((p) =>
        p._id == updatedData.postId ? {...p,comments:updatedData.comments} : p,
      );
      dispatch(setPostData(updatedPosts));
    })

    return ()=>{socket.off('likedPost')
      socket.off('CommentedPost')
    } 
  }, [socket,postData,dispatch]);
  


  return (
    <div className="w-[100%] md:w-[100%] flex flex-col gap-[10px] bg-white items-center rounded-2xl pb-10 border-b-1 border-gray-800">
      <div className="w-full h-[80px] flex justify-center items-center px-[25px]">
        <div className="flex w-[80%] items-center gap-[8px] cursor-pointer" onClick={()=>navigate(`/profile/${post?.author?.username}`)}>
          <div className="w-[40px] h-[40px] md:w-[60px] md:h-[60px] rounded-full border-1 border-black cursor-pointer overflow-hidden">
            <img
              src={post.author?.profilePicture || dp}
              alt=""
              className="w-full object-cover"
            />
          </div>
          <div className="w-[200px] truncate font-semibold ">
            {post.author?.username}
          </div>
        </div>

        {userData?._id !== post.author?._id && (
          <FollowBtn tailwind={'px-[10px] w-[100px] text-white py-[5px] h-[40px] bg-black rounded-2xl font-semibold cursor-pointer'} targetUserId={post.author._id}></FollowBtn>

        )}
      </div>

      <div className="w-[90%] flex flex-col items-center justify-center">
        {post?.mediaType == "image" && (
          <div className="max-w-full h-[100%] flex flex-col items-center justify-center">
            <img
              src={post?.media}
              alt="media"
              className="w-full h-[80%] rounded-2xl object-cover"
            />
          </div>
        )}

        {post?.mediaType == "video" && (
          <div className="w-full h-[80%] md:h-[500px] flex flex-col items-center justify-center">
            <VideoPlayer media={post?.media} />
          </div>
        )}
      </div>

      <div className="w-full flex justify-between items-center px-[20px] mt-2">
        <div className="flex items-center gap-[20px]">
          <div className="flex items-center gap-[5px]">
            {!post?.likes?.includes(userData._id) && (
              <GoHeart
                size={20}
                className="cursor-pointer"
                onClick={handleLike}
              />
            )}
            {post?.likes.includes(userData._id) && (
              <GoHeartFill
                size={25}
                className="cursor-pointer text-red-600"
                onClick={handleLike}
              />
            )}
            <span>{post.likes.length}</span>
          </div>
          <div className="flex items-center gap-[5px] ">
            <MdOutlineMessage
              size={20}
              className="cursor-pointer"
              onClick={() => setShowComments(true)}
            />
            {post.comments.length}
          </div>
        </div>
        <div>
          {userData?.saved?.includes(post?._id) ? (
            <RiBookmarkFill
              size={20}
              className="cursor-pointer"
              onClick={handleSavePost}
            />
          ) : (
            <RiBookmarkLine
              size={20}
              className="cursor-pointer"
              onClick={handleSavePost}
            />
          )}
        </div>
      </div>
      <div className="w-full flex flex-col items-start justify-start px-[22px] gap-2">
        <span className="font-semibold ">{post?.author.username} : </span>
        <p className="font-bold ">{post?.caption}</p>
      </div>

      {showComments && (
        <div className="w-full flex flex-col">
          <div className="flex w-full justify-between h-[80px] items-center px-[20px] relative">
            <div className="w-[30px] h-[30px] md:w-[50px] md:h-[50px] rounded-full border-1 border-black cursor-pointer overflow-hidden">
              <img
                src={post.author?.profilePicture || dp}
                alt=""
                className="w-full object-cover"
              />
            </div>
            <input
              type="text"
              className="px-[10px] border-b-2 border-gray-500 w-[80%] outline-none h-[40px]"
              placeholder="Write comment..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <button>
              <IoSendSharp
                size={25}
                className="cursor-pointer "
                onClick={handleComment}
              />
            </button>
          </div>
          <div className="w-full relative flex flex-col gap-4 mt-4 px-[20px]">
            <div
              className="flex items-center justify-center cursor-pointer"
              onClick={() => setShowComments(false)}
            >
              <GoFoldUp size={35} />
            </div>
            {post.comments.length > 0 ? (
              post.comments
                .slice()
                .reverse()
                .map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex items-center gap-3"
                  >
                    {console.log(item.author)}
                    <img
                      src={item.author?.profilePicture || dp}
                      className="w-[40px] h-[40px] rounded-full object-cover border-1 border-gray-300"
                      alt="author"
                    />
                    <div className="flex flex-col">
                      <div className="text-[13px]">
                        <span className="font-bold mr-2">
                          {item.author?.username} :
                        </span>
                        <span className="text-gray-800 font-semibold">
                          {item.message}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {/* Agar date dikhani ho toh */}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-400 text-xs text-center">
                No comments yet...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;

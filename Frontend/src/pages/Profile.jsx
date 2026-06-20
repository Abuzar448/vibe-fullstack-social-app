import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setprofileData, setUserData } from "../redux/userSlice";
import { IoArrowBackOutline } from "react-icons/io5";
import dp from "../assets/DP.webp";
import Navbar from "../components/Navbar";
import FollowBtn from "../components/FollowBtn";
import Post from "../components/Post";
import { setSelectedUser } from "../redux/messageSlice";

const Profile = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const dispatch = useDispatch();
  const { profileData, userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const [postType, setPostType] = useState("posts");

  const handleProfile = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8080/api/user/getProfile/${username}`,
        { withCredentials: true },
      );
      dispatch(setprofileData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogOut = async () => {
    try {
      const result = await axios.get("http://localhost:8080/api/auth/signout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleProfile();
  }, [username, dispatch]);
  return (
    <div className="w-full min-h-screen bg-black">
      <div className="text-white flex justify-between p-[30px] font-semibold">
        <div className="cursor-pointer" onClick={() => navigate("/")}>
          <IoArrowBackOutline className="w-[25px] h-[25px] text-white" />
        </div>
        <div className="text-[20px]">{profileData?.username}</div>
        <div
          className="font-semibold cursor-pointer text-[20px] text-blue-500"
          onClick={handleLogOut}
        >
          Log Out
        </div>
      </div>

      <div className="flex w-full lg:h-[150px] h-[120px] items-start gap-[20px] lg:gap-[30px] pt-[20px] px-[10px] justify-center">
        <div className="w-[80px] h-[80px] md:w-[140px] md:h-[140px] rounded-full border-2 border-black cursor-pointer overflow-hidden">
          <img
            src={profileData?.profilePicture || dp}
            alt=""
            className="w-full object-cover"
          />
        </div>
        <div>
          <div className="font-semibold text-[22px] text-white">
            {profileData?.name}
          </div>
          <div className="font-semibold text-[22px] text-[#ffffffd2]">
            {profileData?.profession || "New User"}
          </div>
          <div className="font-semibold text-[17px] text-[#ffffffd2]">
            {profileData?.bio}
          </div>
        </div>
      </div>
      <div className="w-full h-[100px] flex items-center justify-center gap-[40px] md:gap-[60px] px-[20%] pt-[30px]">
        <div>
          <div className="text-white text-center text-[22px] md:text-[30px] font-semibold">
            {profileData?.posts.length}
          </div>
          <div className="text-[18px] md:text-[22px] text-[#ffffffd2]">
            Posts
          </div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-[20px] pl-2">
            <div className="flex relative">
              {profileData?.followers?.slice(0, 3).map((follower, idx) => (
                <div
                  key={idx}
                  className={`w-[40px] h-[40px]  rounded-full border-2 border-black cursor-pointer overflow-hidden ${idx > 0 ? `absolute` : ""}`}
                  style={{ right: `${idx * 10}px`, zIndex: 3 - idx }}
                >
                  <img
                    src={follower?.profilePicture || dp}
                    alt=""
                    className="w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="text-white text-[22px] md:text-[30px] font-semibold">
              {profileData?.followers?.length}
            </div>
          </div>
          <div className="text-[18px] md:text-[22px] text-[#ffffffd2]">
            Followers
          </div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-[4px] pl-2">
            <div className="flex relative">
              {profileData?.following?.slice(0, 3).map((following, idx) => (
                <div
                  key={idx}
                  className={`w-[40px] h-[40px] rounded-full border-2 border-black cursor-pointer overflow-hidden ${idx > 0 ? "absolute" : ""}`}
                  style={{
                    right: `${idx * 10}px`,
                    zIndex: 3 - idx,
                  }}
                >
                  <img
                    src={following?.profilePicture || dp}
                    alt=""
                    className="w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="text-white text-[22px] md:text-[30px] font-semibold">
              {profileData?.following?.length}
            </div>
          </div>
          <div className="text-[18px] md:text-[22px] text-[#ffffffd2]">
            Following
          </div>
        </div>
      </div>

      <div className="w-full h-[80px] flex justify-center items-center gap-[20px] mt-[15px]">
        {profileData?._id == userData._id && (
          <button
            className="px-[10px] min-w-[150px] py-[5px] h-[40px] bg-[white] cursor-pointer rounded-2xl"
            onClick={() => navigate("/edit-profile")}
          >
            Edit Profile
          </button>
        )}

        {profileData?._id !== userData._id && (
          <>
            <FollowBtn
              tailwind={
                "px-[10px] w-[100px] text-black py-[5px] h-[40px] bg-white rounded-2xl font-semibold cursor-pointer"
              }
              targetUserId={profileData?._id}
              onFollowChange={handleProfile}
            ></FollowBtn>
            <button className="px-[10px] min-w-[150px] py-[5px] h-[40px] bg-[white] cursor-pointer rounded-2xl font-semibold" onClick={()=>{
              dispatch(setSelectedUser(profileData));
              navigate('/messageArea');
            }}>
              Message
            </button>
          </>
        )}
      </div>

      <div className="w-full min-h-[100vh] flex justify-center">
        <div className=" w-full max-w-[900px] flex flex-col items-center rounded-t-[70px] bg-white relative gap-[20px] pt-[30px] md:px-[50px] px-[12px] pb-[100px]">
          <Navbar></Navbar>
          {userData?._id == profileData?._id && (
            <div className="w-[90%] max-w-[600px] h-[80px] bg-[white] rounded-full flex justify-around items-center gap-[10px]">
              <div
                className={`${postType == "posts" ? "bg-black text-white" : ""}  w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold cursor-pointer rounded-full hover:border-1 hover:border-gray-700`}
                onClick={() => setPostType("posts")}
              >
                Posts
              </div>

              <div
                className={`${postType == "saved" ? "bg-black text-white" : ""}  w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold cursor-pointer rounded-full hover:border-1 hover:border-gray-700`}
                onClick={() => setPostType("saved")}
              >
                Saved
              </div>
            </div>
          )}

          {postType == "posts" &&
            postData?.map((post, idx) =>
              post?.author?._id == profileData?._id ? (
                <Post key={post?._id || idx} post={post} />
              ) : null,
            )}

          {postType == "saved" &&
            postData?.map((post, idx) =>
              userData?.saved?.includes(post?._id) ? (
                <Post key={post?._id || idx} post={post} />
              ) : null,
            )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

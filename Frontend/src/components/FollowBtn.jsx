import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toggleFollow } from "../redux/userSlice";

const FollowBtn = ({ targetUserId, tailwind, onFollowChange }) => {
  const { following } = useSelector((state) => state.user);
  const isFollowing = following.includes(targetUserId);
  const dispatch = useDispatch();

  const handleFollow = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8080/api/user/Follow/${targetUserId}`,
        { withCredentials: true },
      );
      if (onFollowChange) {
        onFollowChange();
      }
      dispatch(toggleFollow(targetUserId));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button onClick={handleFollow} className={tailwind}>
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
};

export default FollowBtn;

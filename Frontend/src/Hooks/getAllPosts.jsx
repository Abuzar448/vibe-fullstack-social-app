import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPostData } from "../redux/postSlice";
import { useSelector } from "react-redux";

const getAllPosts = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const result = await axios.get(
          "http://localhost:8080/api/post/all-posts",
          { withCredentials: true },
        );
        dispatch(setPostData(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPosts();
  }, [dispatch, userData]);
};

export default getAllPosts;

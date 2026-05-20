import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoopData } from "../redux/loopSlice";
import { useSelector } from "react-redux";

const getAllReels = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchAllReels = async () => {
      try {
        const result = await axios.get(
          "http://localhost:8080/api/reel/all-reels",
          { withCredentials: true },
        );
        dispatch(setLoopData(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllReels();
  }, [dispatch, userData]);
};

export default getAllReels;

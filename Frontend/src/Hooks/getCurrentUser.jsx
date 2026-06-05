import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFollowing, setUserData } from '../redux/userSlice'


const getCurrentUser = () => {
  const dispatch = useDispatch();
  const {storyData} = useSelector((state)=>state.story);
  useEffect(() => {
    const fetchUser = async ()=>{
      try { 
        const result = await axios.get('http://localhost:8080/api/user/current', {withCredentials:true});
        dispatch(setUserData(result.data));
        dispatch(setFollowing(result.data.following));
      } catch (error) {
        console.log(error);
      }
    }
    // Logic to get the current user
    fetchUser();
  }, [storyData])
}

export default getCurrentUser;
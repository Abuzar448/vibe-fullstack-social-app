import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFollowing, setUserData } from '../redux/userSlice'
import { setStoryList } from '../redux/storySlice'


const getAllStories = () => {
  const dispatch = useDispatch();
  const {userData} = useSelector((state)=>state.user);
  useEffect(() => {
    const fetchStories = async ()=>{
      try { 
        const result = await axios.get('http://localhost:8080/api/story/getAllStories', {withCredentials:true});
        dispatch(setStoryList(result.data));
      } catch (error) {
        console.log(error);
      }
    }
    fetchStories();
  }, [userData])
}

export default getAllStories;
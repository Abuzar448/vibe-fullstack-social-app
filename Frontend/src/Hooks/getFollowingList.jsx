import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFollowing, setUserData } from '../redux/userSlice'
import { setCurrentUserStory } from '../redux/storySlice'


const getFollowingList = () => {
  const dispatch = useDispatch();
  const {userData} = useSelector((state)=>state.user);
  useEffect(() => {
    const fetchUser = async ()=>{
      try { 
        const result = await axios.get('http://localhost:8080/api/user/followingList', {withCredentials:true});
        dispatch(setFollowing(result.data));
      } catch (error) {
        console.log(error);
      }
    }
    // Logic to get the followingLists
    fetchUser();
  }, [userData]);
}

export default getFollowingList;
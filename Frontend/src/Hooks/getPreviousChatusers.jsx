import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFollowing, setUserData } from '../redux/userSlice'
import { setCurrentUserStory } from '../redux/storySlice'
import { setPreviousChatUsers } from '../redux/messageSlice'


const getPreviousChatusers = () => {
  const dispatch = useDispatch();
  const {messages} = useSelector((state)=>state.message);
  useEffect(() => {
    const fetchUser = async ()=>{
      try { 
        const result = await axios.get('http://localhost:8080/api/message/previousChats', {withCredentials:true});
        dispatch(setPreviousChatUsers(result.data));
      } catch (error) {
        console.log(error);
      }
    }
    fetchUser();
  }, [messages])
}

export default getPreviousChatusers;
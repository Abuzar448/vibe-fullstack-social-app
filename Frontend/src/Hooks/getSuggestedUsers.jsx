import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSuggestedUsers } from '../redux/userSlice'


const getSuggestedUsers = () => {

  const {userData} = useSelector(state=>state.user);

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async ()=>{
      try { 
        const result = await axios.get('http://localhost:8080/api/user/suggested', {withCredentials:true});
        dispatch(setSuggestedUsers(result.data));
      } catch (error) {
        console.log(error);
      }
    }
    // Logic to get the current user
    fetchUser();
  }, [userData])
}

export default getSuggestedUsers
import React, { useEffect } from 'react'
import { Routes , Route } from 'react-router-dom';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Home from './pages/Home.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import getCurrentUser from './Hooks/getCurrentUser.jsx';
import getSuggestedUsers from './Hooks/getSuggestedUsers.jsx';
import getAllPosts from './Hooks/getAllPosts.jsx';
import Profile from './pages/Profile.jsx';
import EditProfile from './pages/EditProfile.jsx';
import Upload from './pages/Upload.jsx';
import Reel from './pages/Reel.jsx';
import getAllReels from './Hooks/getAllReels.jsx';
import Story from './pages/Story.jsx';
import getAllStories from './Hooks/getAllStories.jsx';
import Message from './pages/Message.jsx';
import MessageArea from './pages/MessageArea.jsx';
import {io} from 'socket.io-client';
import { setOnlineusers, setSocket } from './redux/socketSlice.js';
import getFollowingList from './Hooks/getFollowingList.jsx';
import getPreviousChatusers from './Hooks/getPreviousChatusers.jsx';

const App = () => {

  getCurrentUser();
  getSuggestedUsers();
  getAllPosts();
  getAllReels();
  getAllStories();
  getFollowingList();
  getPreviousChatusers();

  const {userData} = useSelector((state)=>state.user);
  const {socket} = useSelector((state)=>state.socket);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(userData){
      const socketIo = io('http://localhost:8080',{
        query:{
          userId:userData._id
        }
      })
      dispatch(setSocket(socketIo));

      socketIo.on('getOnlineUsers',(users)=>{
        dispatch(setOnlineusers(users))
      })

      return ()=>socketIo.close();
    }    
    else{
      if(socket){
        socket.close()
        dispatch(setSocket(null));
      }
    }
    
  },[userData]);

    return (

    <Routes>
      <Route path='/signin' element={!userData ? <SignIn/> : <Navigate to='/'/>}/>
      <Route path='/signup' element={!userData ? <SignUp/> : <Navigate to='/'/>}/>
      <Route path='/forgot-password' element={!userData ? <ForgotPassword/> : <Navigate to='/'/>}/>
      <Route path='/' element = {userData ? <Home/> : <Navigate to='/signin'/>}/>
      <Route path='/profile/:username' element = {userData ? <Profile/> : <Navigate to='/signin'/>}/>
      <Route path='/story/:username' element = {userData ? <Story/> : <Navigate to='/signin'/>}/>
      <Route path='/upload' element = {userData ? <Upload/> : <Navigate to='/signin'/>}/>
      <Route path='/edit-profile' element = {userData ? <EditProfile/> : <Navigate to='/signin'/>}/>
      <Route path='/reels' element = {userData ? <Reel/> : <Navigate to='/signin'/>}/>
      <Route path='/messages' element = {userData ? <Message/> : <Navigate to='/signin'/>}/>
      <Route path='/messageArea' element = {userData ? <MessageArea/> : <Navigate to='/signin'/>}/>
    </Routes>

  )
}

export default App;
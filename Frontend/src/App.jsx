import React from 'react'
import { Routes , Route } from 'react-router-dom';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Home from './pages/Home.jsx';
import { useSelector } from 'react-redux';
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

const App = () => {

  getCurrentUser();
  getSuggestedUsers();
  getAllPosts();
  getAllReels();

  const {userData} = useSelector((state)=>state.user);

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
    </Routes>

  )
}

export default App;
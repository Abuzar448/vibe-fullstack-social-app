import React from 'react'
import logo from '../assets/logo.png'
import logo2 from '../assets/logo2.png'
import { useState } from 'react';
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const SignIn = () => {

  const navigate = useNavigate();

  const [inputClicked, setInputClicked] = useState({
    username:false,
    password:false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error,setError] = useState('');

  const dispatch = useDispatch();

  const handleSignIn = async() => {
    setError('');
    setLoading(true); 
    try {
      const response = await axios.post('http://localhost:8080/api/auth/signin', {
        username, 
        password
      }, { withCredentials: true });
      setLoading(false);
      dispatch(setUserData(response.data));
    } catch (error) {
      setError(error.response?.data?.message);
      setLoading(false);
      console.error(error);
    }
  }

  return (
    <div className='w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center'>
      <div className='w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]'>
        <div className='w-full lg:w-[50%] h-full bg-white flex flex-col justify-center items-center p-[10px] gap-[20px]'>
          <div className='flex gap-[10px] items-center text-[20px] font-semibold mt-[40px]'>
            <span>Sign In to </span>
            <img src={logo} alt="" className='w-[70px]'/>
          </div>


          <div className='relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl mt-[20px] border-2 border-black' onClick={()=>setInputClicked({...inputClicked,username:true})}>
            <label htmlFor='username' className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.username ? 'top-[-15px]':''}`}>Enter Your Username</label>
              <input type="text" id='username' className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0' required onChange={(e)=>setUsername(e.target.value)}/>
          </div>


          <div className='relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl mt-[5px] border-2 border-black' onClick={()=>setInputClicked({...inputClicked,password:true})}>
            <label htmlFor='password' className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.password ? 'top-[-15px]':''}`}>Enter Your Password</label>
              <input type={showPassword ? "text" : "password"} id='password' className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0' required onChange={(e)=>setPassword(e.target.value)}/>
              {!showPassword ?<IoIosEye className='absolute curser-pointer right-[20px] w-[25px] h-[25px] cursor-pointer' onClick={()=>setShowPassword(true)}/> :<IoIosEyeOff className='absolute curser-pointer right-[20px] w-[25px] h-[25px] cursor-pointer' onClick={()=>setShowPassword(false)}/>} 
          </div>
          
          <div className='w-[90%] px-[20px] cursor-pointer font-semibold text-gray-700' onClick={()=>navigate('/forgot-password')}>Forgot Password ?</div>

          {error && <p className='text-red-700'>{error}</p>}


          <button className='w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]' onClick={handleSignIn} disabled={loading}>{loading?<ClipLoader size={30} color={"white"}/> : 'Sign In'}</button>
          <p className='cursor-pointer font-semibold' onClick={()=>navigate('/signup')}>New to VIBE? <span className='text-blue-500 cursor-pointer'>Sign Up</span></p>
        </div> 

        <div className='md:w-[50%] h-full hidden lg:flex justify-center items-center bg-[#000000] flex-col gap-[10px] text-white text-[16px] font-semibold rounded-l-[30px] shadow-2xl shadow-black'>
          <img src={logo2} alt="" className='w-[40%]'/>
          <p>Not Just A Platform , It's A VIBE.</p>
        </div>
      </div>
    </div>
  )
}

export default SignIn;
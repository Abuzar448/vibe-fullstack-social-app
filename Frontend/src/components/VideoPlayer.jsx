import React, { useRef, useState } from 'react'
import { FaVolumeMute } from "react-icons/fa";
import { VscUnmute } from "react-icons/vsc";

const VideoPlayer = ({media}) => {
  const videoTag = useRef();
  const [mute,setMute] = useState(false);
  const [isPlaying,setIsPlaying] = useState(true);

  const handelClick = ()=>{
    if(isPlaying){
      videoTag.current.pause();
      setIsPlaying(false);
    }
    else{
      videoTag.current.play();
      setIsPlaying(true);
    }
  }


  return (
    <div className='h-[100%] relative cursor-pointer max-w-full rounded-2xl '>
      <video ref={videoTag} src={media} autoPlay loop muted={mute} className='h-[100%] cursor-pointer w-full rounded-2xl object-cover' onClick={handelClick}></video>
      {!mute ? <FaVolumeMute className='absolute w-[20px] h-[20px] bottom-2 right-2 text-[white]' onClick={()=>setMute(true)}/> : <VscUnmute className='absolute w-[20px] h-[20px] bottom-2 right-2 text-[white]' onClick={()=>setMute(false)}/>}
      
      
    </div>
  )
}

export default VideoPlayer
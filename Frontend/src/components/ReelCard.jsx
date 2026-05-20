import React, { useRef } from 'react'

const ReelCard = ({loop,idx}) => {
  const videoRef = useRef();
  return (
    <div className="w-full h-full lg:h-[95vh] lg:max-h-[850px] lg:rounded-xl flex items-center justify-center border-zinc-800/80 lg:border relative overflow-hidden bg-black shadow-2xl">
<video autoPlay loop playsInline ref={videoRef} src={loop?.media} className='w-full h-full object-cover md:object-contain'/>
    </div>
  )
}

export default ReelCard
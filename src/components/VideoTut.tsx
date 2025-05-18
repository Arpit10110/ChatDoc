import React from 'react'

const VideoTut = () => {
  return (
    <>
        <div id='howitworks' className='py-[5rem]  flex flex-col gap-[5rem] ' >
            <h2 className='text-[3rem] text-center font-semibold max-tablet:w-[90%] m-auto max-mobile:text-[2.6rem] max-smobile:text-[2.3rem] max-xsmobile:text-[2rem]  ' >Watch how fast you go from <br /> “Ugh, a PDF 😤” To “Ahh, got it! 😎” </h2>
            <div className='w-[100%] flex justify-center items-center ' >
                <video
                  style={{ boxShadow: '0px 0px 20px 6px rgb(72,64,196,0.30)' }} 
                  className='w-[80%] rounded-[1rem] max-tablet:w-[90%] ' src={"/HomePageVideo1.mp4"}
                  autoPlay={true} loop={true} muted={true} ></video>
            </div>
        </div>
    </>
  )
}

export default VideoTut
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import herogif from "@/assets/herogif.gif"
const HeroSection = () => {
  return (
    <>
        <div className='w-full min-h-[70vh] relative ' >
            <div className='w-full flex flex-col justify-center items-center gap-[2.5rem] my-[8rem] cursor-default ' >
                <h1 className='font-tektur text-[3.5rem] font-bold   ' >🔥 Slide Your PDF In, Get Instant Answers 🔥</h1>
                <p className='w-[75%] text-center text-[2rem] ' >
                PDFs were never supposed to be this cool. Just upload, ask anything, and get instant answers like you're chatting with a real one. No more scrolling through 100 pages like it's 2005.
                </p>
                <Link className='text-[2rem] bg-[#158cbc7a] px-[3rem] py-[0.5rem] rounded-[10px] hover:scale-[1.03] transition-all font-semibold ' href={"/playground"} >Let's Get Nerdy 🤖</Link>
            </div>
            <Image className='absolute bottom-0 right-[2rem] w-[20%] ' src={herogif} alt='Helllo' />
        </div>
    </>
  )
}

export default HeroSection
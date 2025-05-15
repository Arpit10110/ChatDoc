"use client"
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import herogif from "@/assets/herogif.gif"
import { TypeAnimation } from 'react-type-animation';
const HeroSection = () => {
  return (
    <>
        <div className='w-full bg-[#ffffff0f] py-[5rem] ' >
            <div className='w-full flex flex-col justify-center items-center gap-[2.5rem] cursor-default ' >
                <h1 className='font-tektur text-[3.5rem] font-bold   ' >🔥 Slide Your PDF In, Get Instant Answers 🔥</h1>
                <p className='w-[75%] text-center text-[2rem] ' >
                PDFs were never supposed to be this cool. Just upload, ask anything, and get instant answers like you're chatting with a real one. No more scrolling through 100 pages like it's 2005.
                </p>
                
                <Link className='inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(125deg,#000000,45%,#28292b,55%,#000000)] bg-[length:200%_100%] px-[3rem] font-medium text-slate-400  focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 py-[2rem] hover:scale-[1.03] text-[2.5rem] transition-all ' href={"/playground"} >Let's Get Nerdy 🤖</Link>
            </div>
            <div className='flex justify-between w-[80%] m-auto items-center ' >
              <div className='flex flex-col gap-[1rem] min-w-[40%] ' >
                  <div className='!text-[2rem] font-semibold ' >
                    <TypeAnimation
                        sequence={[
                          'Chat with your PDFs 🤖📄',
                          1000,
                          'Ask anything, get instant answers ⚡️',
                          1000,
                          'Make boring docs talk 🗣️',
                          1000,
                          'Turn files into conversations 💬',
                          1000,
                          'No more scrolling — just ask! 🙌',
                          1000,
                        ]}
                        wrapper="span"
                        speed={30}
                        repeat={Infinity}
                      />
                  </div>
                  <Link className='inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(125deg,#000000,45%,#28292b,55%,#000000)] bg-[length:200%_100%] px-[3rem] font-medium text-slate-400  focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 py-[2rem] hover:scale-[1.03] text-[2rem] transition-all w-fit ' href={"/playground"} >🎥 Watch How It Works</Link>
              </div>
              <div className='w-[20%] ' >
                <Image className='w-full ' src={herogif} alt='Helllo' />
              </div>
            </div>
        </div>
    </>
  )
}

export default HeroSection
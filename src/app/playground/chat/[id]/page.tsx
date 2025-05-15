"use client";
import Navbar from "@/components/Navbar";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Page = ({ params }: any) => {
  const [unwrappedParams, setUnwrappedParams] = useState<any>(null);
  const [ChatName, setChatName] = useState<string>("");
  const [UserChat,SetUserChat] = useState<any>(null);
  useEffect(() => {
    params
      .then((resolvedParams: any) => {
        setUnwrappedParams(resolvedParams);
        setChatName(resolvedParams.id);
      })
      .catch((err: any) => {
        console.log("error", err);
      });
  }, [params]);

  const chatai = async()=>{
    try {
        const {data} = await axios.post("/api/chatai",{
            userquery:UserChat,
            chatname:ChatName
        })
        console.log(data);
    } catch (error) {
        console.log(error);
    }
  }

  return (
    <>
    <Navbar/>
        <div className="flex justify-center gap-[1rem]" >
            <input onChange={(e)=>SetUserChat(e.target.value)} className="bg-white text-black w-[50%] text-[1.3rem] px-[0.5rem]" type="text" />
            <button onClick={chatai} className="bg-gray-900 px-[2rem] py-[0.5rem] text-[1.2rem]" >Sent</button>
        </div>
    </>
  )
};

export default Page;
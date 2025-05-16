"use client";
import Navbar from "@/components/Navbar";
import axios from "axios";
import React, { useEffect, useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
const Page = ({ params }: any) => {
  const [unwrappedParams, setUnwrappedParams] = useState<any>(null);
  const [ChatName, setChatName] = useState<string>("");
  const [UserChat,SetUserChat] = useState<any>("");
  const [ChatData, setChatData] = useState<any[]>([]);

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
      const userquery = UserChat;
      SetUserChat("");
        const {data} = await axios.post("/api/chatai",{
            userquery:userquery,
            chatname:ChatName
        })
        const newUserMessage = { role: "ai", message: data.data };
        setChatData((prev) => [...prev, newUserMessage]);
    } catch (error) {
        console.log(error);
    }
  }

  const showchat = ()=>{
    if (!UserChat.trim()) return;
    const newUserMessage = { role: "user", message: UserChat };
    setChatData((prev) => [...prev, newUserMessage]);
    chatai();
  }

  return (
    <>
    <Navbar/>
    <div className="w-[80%] bg-[#ffffff19] h-[80vh] m-auto rounded-[1rem] " >
      <div className="w-full h-[90%] px-[1rem] py-[2rem] gap-[2rem] flex flex-col  " >
        {
                ChatData.map((i,index)=>{
                  return(
                        <div key={index} className="flex gap-[0.5rem]  items-start  " >
                          {
                             i.role=="user"?
                             <PersonIcon className="!text-[2rem] !text-[#26deff] " />:
                              <AutoAwesomeIcon className="!text-[2rem] !text-[#ff1ba8] " />
                          }
                          {
                            i.role=="user"?
                            <h1 className="text-[1.5rem] font-semibold text-[#e7e2e2] " >{i.message}</h1>:
                            <h1 className="text-[1.5rem] font-semibold  " >{i.message}</h1>
                          }
                        </div>
                  )
                })
        }
      </div>
        <div className="flex justify-center items-center gap-[0.5rem] w-full h-[10%] " >
            <input onChange={(e)=>SetUserChat(e.target.value)} className="bg-white text-black w-[90%] text-[1.5rem] font-semibold py-[0.3rem] px-[0.5rem] rounded-[5px] " type="text" value={UserChat} />
            <button onClick={showchat} className="bg-[#ffffff34] px-[1.5rem] py-[0.3rem] text-[1.5rem] rounded-[5px] font-bold " >Ask</button>
        </div>  
    </div>
    </>
  )
};

export default Page;



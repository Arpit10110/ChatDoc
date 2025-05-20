"use client";
import Navbar from "@/components/Navbar";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import loadinggif from "@/assets/loading.gif";
import Image from "next/image";
import { SignedIn, SignedOut } from '@clerk/nextjs'
import Link from "next/link";


const Page = ({ params }: any) => {
  const [unwrappedParams, setUnwrappedParams] = useState<any>(null);
  const [ChatName, setChatName] = useState<string>("");
  const [UserChat, SetUserChat] = useState<string>("");
  const [ChatData, setChatData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    // Auto scroll to bottom when chat updates
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ChatData, streamingMessage]);

  const chatai = async () => {
    try {
      const userquery = UserChat;
      SetUserChat("");
   
      setStreamingMessage("");
      setLoading(true);
  
      const { data } = await axios.post("/api/chatai", {
        userquery: userquery,
        chatname: ChatName,
        chatdata : ChatData,
      });
      setLoading(false);
      setIsStreaming(true);
      const fullMessage = data.data;
      let currentIndex = 0;
      let builtMessage = "";
  
      const typeNextChar = () => {
        if (currentIndex < fullMessage.length) {
          builtMessage += fullMessage[currentIndex];
          setStreamingMessage(builtMessage); // Always update the entire string
          currentIndex++;
          setTimeout(typeNextChar, 50); // typing speed
        } else {
          setChatData((prev) => [...prev, { role: "ai", message: builtMessage }]);
          setStreamingMessage(""); // clear the temporary streamer
          setIsStreaming(false);
        }
      };
  
      typeNextChar();
    } catch (error) {
      console.log(error);
      setLoading(false);
      setIsStreaming(false);
      alert("Something went wrong while predicting.");
    }
  };
  

  const showchat = () => {
    if (!UserChat.trim()) return;
    const newUserMessage = { role: "user", message: UserChat };
    setChatData((prev) => [...prev, newUserMessage]);
    chatai();
  };

  return (
    <>
      <Navbar />
      <SignedOut>
            <div className='mt-[3rem] flex w-[90%] m-auto justify-center flex-col  '>
                <h1 className='text-[2rem] font-semibold text-center'>Please Sign In to start the chat</h1>
                <Link className="m-auto w-fit bg-gray-900 px-[2rem] py-[0.8rem] rounded-[1rem] font-semibold text-[1.5rem] hover:scale-[1.02] transition-all cursor-pointer mt-[1.5rem] " href={"/sign-in"}>Please SignIn</Link>
            </div>
      </SignedOut>
      <SignedIn>
          <div className="w-[80%] max-tablet:w-[90%] bg-[#ffffff19] h-[80vh] m-auto rounded-[1rem] flex flex-col overflow-hidden">
            <div className="allchat w-full h-[90%] px-[1rem] py-[2rem] gap-[1rem] flex flex-col overflow-y-auto">
              {ChatData.map((item, index) => (
                <div key={index} className="flex gap-[0.5rem] items-start">
                  {item.role === "user" ? (
                    <PersonIcon className="!text-[2rem] !text-[#26deff]" />
                  ) : (
                    <AutoAwesomeIcon className="!text-[2rem] !text-[#ff1ba8]" />
                  )}
                  <h1
                    className={`text-[1.5rem] font-semibold ${
                      item.role === "user" ? "text-[#e7e2e2]" : ""
                    }`}
                  >
                    {item.message}
                  </h1>
                </div>
              ))}

              {isStreaming && (
                <div className="flex gap-[0.5rem] items-start">
                  <AutoAwesomeIcon className="!text-[2rem] !text-[#ff1ba8]" />
                  <h1 className="text-[1.5rem] font-semibold">{streamingMessage}</h1>
                </div>
              )}

              {loading && (
                <div className="flex">
                  <Image
                    src={loadinggif}
                    alt="Loading..."
                    className="w-[9%] object-cover h-[5vh]"
                  />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="flex justify-center items-center gap-[0.5rem] w-full h-[10%] px-[1rem]">
              <input
                onChange={(e) => SetUserChat(e.target.value)}
                className="bg-white text-black w-[90%] text-[1.5rem] font-semibold py-[0.3rem] px-[0.5rem] rounded-[5px]"
                type="text"
                value={UserChat}
                onKeyDown={(e) => {
                  if (e.key === "Enter") showchat();
                }}
              />
              <button
                onClick={showchat}
                className="bg-[#4c26b9] px-[1.5rem] py-[0.3rem] text-[1.5rem] rounded-[5px] font-bold"
              >
                Ask
              </button>
            </div>
          </div>
      </SignedIn>
      
    </>
  );
};
 
export default Page;

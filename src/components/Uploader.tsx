"use client";
import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { FileUpload } from "@/components/ui/file-upload";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
// Set the workerSrc to a CDN path
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`;

const Uploader = () => {

  const [FileText, SetFileText] = useState<string>("");
  const [FileName, SetFileName] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [Totalpages,SetTotalpages] = useState<number>(0);

  const pdfextractor = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function () {
      const typedarray = new Uint8Array(reader.result as ArrayBuffer);

      try {
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        let extractedText = ""; // Initialize an empty string to store the extracted text
        SetTotalpages(pdf.numPages);
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const textItems = textContent.items.map((item: any) => item.str);
          extractedText += textItems.join(" ") ;
        }
        SetFileText(extractedText); 
      } catch (err) {
        console.error("Error reading PDF:", err);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const submitFile = async () => {
    try {
      const {data} = await axios.post("/api/uploadfile",{
        filetext: FileText,
        filename:FileName,
        totalpages:Totalpages
      })
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const findthechatname = async ()=>{
    try {
      setOpen(true);
      if(FileText == ""){
        setOpen(false);
        toast.error("Please upload a file", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
        return;
      }
      const {data} = await axios.post("api/findchatname",{
        filename:FileName
      })
      console.log(data);
      if(data.success){
        submitFile();
      }else{
        setOpen(false);
        toast.error(data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
      }
    } catch (error) {
      setOpen(false);
      console.log(error);
    }
  }

  return (
    <>
     <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="mt-[1rem] flex w-[90%] m-auto justify-center flex-col">
        <div className=" w-full " >
          <input type="text" placeholder="Name this PDF chat session" className="bg-[#fffefe1c]  w-[30%] text-[1.3rem] py-[0.5rem] px-[1rem] rounded-[5px]" onChange={(e)=>SetFileName(e.target.value)}/>
        </div>
        <FileUpload onChange={pdfextractor} />
        <div className="w-full mt-[1rem] flex justify-center items-center">
          <button
            onClick={findthechatname}
            className="m-auto w-fit bg-[#fffefe1c] px-[5rem] py-[0.8rem] rounded-[1rem] font-semibold text-[1.5rem] hover:scale-[1.02] transition-all cursor-pointer"
          >
            Submit the file
          </button>
        </div>
        <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        />
      </div>
    </>
  );
};

export default Uploader;

"use client";
import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { FileUpload } from "@/components/ui/file-upload";
import axios from 'axios';

// Set the workerSrc to a CDN path
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`;

const Uploader = () => {

  const [FileText, SetFileText] = useState<string>("");

  const pdfextractor = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function () {
      const typedarray = new Uint8Array(reader.result as ArrayBuffer);

      try {
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        let extractedText = ""; // Initialize an empty string to store the extracted text

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
      const {data} = await axios.post("api/uploadfile",{
        filetext: FileText
      })
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-[1rem] flex w-[90%] m-auto justify-center flex-col">
      <FileUpload onChange={pdfextractor} />
      <div className="w-full mt-[1rem] flex justify-center items-center">
        <button
          onClick={submitFile}
          className="m-auto w-fit bg-gray-900 px-[2rem] py-[0.8rem] rounded-[1rem] font-semibold text-[1.5rem] hover:scale-[1.02] transition-all cursor-pointer"
        >
          Submit the file
        </button>
      </div>
    </div>
  );
};

export default Uploader;

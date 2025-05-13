import { NextResponse } from "next/server"

export const POST = async(req:any)=>{
    try {
        const filetext =await req.body
        console.log("Extracted Text: ", filetext)
        return    NextResponse.json({
            success:true,
            message:" file uploaded successfully",
            filetext: filetext
        })
    } catch (error) {
        return    NextResponse.json({
            success:false,
            message:"Error in uploading the file",
            error: error
        })
    }
} 
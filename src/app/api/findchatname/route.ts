import { NextResponse } from "next/server";
import {connectdb} from "@/db/connectdb"
export const POST = async(req:any)=>{
    try {
        const {filename} = await req.json();
        const dbcollection = await connectdb();
        console.log("Filename: ", filename);
        const chatnames = await dbcollection?.find({chat_name:filename}).toArray();
        
        if(chatnames?.length === 0){
            return NextResponse.json({
                success:true,
                message:"Yes this chat name is available",
            })
        }else{
            return NextResponse.json({
                success:false,
                message:"Please choose another chat name",
            })
        }

    } catch (error) {
       return NextResponse.json({
            success:false,
            error:error
        })
    }
}
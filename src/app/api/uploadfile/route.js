import { NextResponse } from "next/server"
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter"
import { InferenceClient } from "@huggingface/inference";
import {connectdb} from "@/db/connectdb"
import { currentUser } from '@clerk/nextjs/server'
import {Mongconnectdb} from "@/mongodb/dbconnect"
import {UserData} from "@/Model/userdata"
export const POST = async(req)=>{
    try {
        const User = await currentUser()
        const dbcollection = await connectdb();
        const {filetext,filename,totalpages} =await req.json()
        console.log(filename,filetext,totalpages);

        //coonect the mongodb
        const db = await Mongconnectdb();
        
        const cc= Math.floor(totalpages/10);
        let chunksize; 
       if(cc==0){
         chunksize = 1000;
       }else{
         chunksize = cc*1000;
       }




        const spliter = new RecursiveCharacterTextSplitter({
                    chunkSize:chunksize,
                    separators:['\n\n','\n' ,'  ','  '],
                    chunkOverlap:100 
                })

        const chunk = await spliter.splitText(filetext);

        if(!User){
            return NextResponse.json({
                success:false,
                message:"Please LogIn to use this Service "
            })
        }else{

            await UserData.create({
                userid:User.id,
                chatname:filename
            })

            for(let i=0;i<chunk.length;i++){
                let chunkdata = chunk[i];
                const client = new InferenceClient(`${process.env.NEXT_PUBLIC_API_VECTOR_EMBEDING_API}`);
                const output = await client.featureExtraction({
                    model: "intfloat/multilingual-e5-large",
                    inputs: chunkdata,
                    provider: "hf-inference",
                });
                console.log(output)
                const res = await dbcollection.insertOne({
                    $vector: output,
                    description:chunkdata,
                    userid:User.id,
                    chat_name:filename
                })
                console.log(res)
            }
        }
        

        return    NextResponse.json({
            success:true,
            message:" file uploaded successfully",
            chunkdata:chunk
        })
    } catch (error) {
        return    NextResponse.json({
            success:false,
            message:"Error in uploading the file",
            error: error
        })
    }
} 
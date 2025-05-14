import { NextResponse } from "next/server"
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter"
import { InferenceClient } from "@huggingface/inference";
import {connectdb} from "@/db/connectdb"
import { currentUser } from '@clerk/nextjs/server'

export const POST = async(req)=>{
    try {
        const User = await currentUser()
        const dbcollection = await connectdb();
        const {filetext} =await req.json()
        const spliter = new RecursiveCharacterTextSplitter({
                    chunkSize:500,
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
            for(let i=0;i<chunk.length;i++){
                let chunkdata = chunk[i];
                const client = new InferenceClient(`${process.env.NEXT_PUBLIC_API_VECTOR_EMBEDING_API}`);
                const output = await client.featureExtraction({
                    model: "intfloat/multilingual-e5-large",
                    inputs: "Today is a sunny day and I will get some ice cream.",
                    provider: "hf-inference",
                });
                console.log(output)
                const res = await dbcollection.insertOne({
                    $vector: output,
                    description:chunkdata,
                    userid:User.id,
                    chat_name:"samplepdf"
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
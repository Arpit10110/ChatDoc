import { NextResponse } from "next/server";
import {connectdb} from "@/db/connectdb"
import { InferenceClient } from "@huggingface/inference";
import { GoogleGenAI } from "@google/genai";
import { currentUser } from '@clerk/nextjs/server'


export const POST = async(req)=>{
    try {
        const User = await currentUser()
        const {userquery,chatname,chatdata} = await req.json();
        if (!User) {
        return NextResponse.json({
          success: false,
          message: "User not authenticated",
        });
        }

        const dbcollection = await connectdb();

        const client = new InferenceClient(`${process.env.NEXT_PUBLIC_API_VECTOR_EMBEDING_API}`);
                
        const messagevector= await client.featureExtraction({
                    model: "intfloat/multilingual-e5-large",
                    inputs: userquery,
                    provider: "hf-inference",
        });

        console.log(User.id )
        console.log(chatname)

        const cursor = await dbcollection?.find(
            {
                userid: User.id, // Filter by the authenticated user's ID
                chat_name: chatname, // Filter by the specified chat name
              },{
            sort:{
                $vector:messagevector,
                
            },
            limit:3
        })

        const doucment  = await cursor?.toArray() 
        console.log("doucment",doucment)

        // starting gemni AI

        const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_API_Gemni_Api_key});
        // const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const context = `
        START CONTEXT
            ${doucment?.map((doc) => doc.description).join("\n")}
        END CONTEXT
        `

        const formattedChatHistory = chatdata
        .map((msg) => `${msg.role === "user" ? "User" : "AI"}: ${msg.message}`)
        .join("\n");

        const AIprompt = `
        You are an AI assistant created by Arpit Agrahari for his ChatDoc website where user upload the pdf and ask question from their. Your primary role is to answer user questions using the provided context.
        Chat History:
        ${formattedChatHistory}

        Context:
        ${context}
        
        Guidelines:
        1. Use the given context to generate responses naturally.
        2. Do **not** start responses with phrases like "Based on the provided context."
        3. If the answer is not found in the context, respond with:
        "I'm sorry, I do not know the answer."
        4. Keep responses clear, concise, and directly relevant to the user's question.
        5. If the context is incomplete or partial, you may add helpful related information to complete the answer — but only if it improves clarity.
        6. If the user asks for a **summary** of the document, provide a brief 2–3 line summary based solely on the context, as if from your own point of view.

        Always answer directly, naturally, and with helpful tone.
        `;

        const airesult = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `UserQuestion: ${userquery} \n Context:${AIprompt }`,
          });

        return NextResponse.json({
            success:true,
            messagevector:messagevector,
            document:doucment,
            data:airesult.text
        })

    } catch (error) {
       return NextResponse.json({
            success:false,
            error:error
        })
    }
}
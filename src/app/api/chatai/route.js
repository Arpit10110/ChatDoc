import { NextResponse } from "next/server";
import {connectdb} from "@/db/connectdb"
import { InferenceClient } from "@huggingface/inference";
import { GoogleGenAI } from "@google/genai";


export const POST = async(req)=>{
    try {
        const {userquery,chatname} = await req.json();
        const dbcollection = await connectdb();

        console.log(userquery,chatname);
        const client = new InferenceClient(`${process.env.NEXT_PUBLIC_API_VECTOR_EMBEDING_API}`);
                
        const messagevector= await client.featureExtraction({
                    model: "intfloat/multilingual-e5-large",
                    inputs: userquery,
                    provider: "hf-inference",
        });


        const cursor = await dbcollection?.find(null,{
            sort:{
                $vector:messagevector
            },
            limit:2
        })

        const doucment  = await cursor?.toArray() 

        console.log(doucment)

        // starting gemni AI

        const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_API_Gemni_Api_key});
        // const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const context = `
        START CONTEXT
            ${doucment?.map((doc) => doc.description).join("\n")}
        END CONTEXT
        `

        const AIprompt = `
        You are an AI assistant created by Arpit Agrahari for his ChatDoc website where user upload the pdf and ask question from their. Your primary role is to answer user questions using the provided context.
        
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

          console.log(airesult)

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
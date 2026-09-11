import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

const baseUrl = process.env.OMNIROUTE_BASE_URL;
const apiKey = process.env.OMNIROUTE_API_KEY;
const MODEL = process.env.MODEL;

const client = new Anthropic({
    baseURL: baseUrl,
    apiKey: apiKey,
});


export async function askLLM(systemPrompt:string, userPrompt:string):Promise<string>{
    const response = await client.messages.create({
        model: "auto",
        max_tokens:1024,
        system:systemPrompt,
        messages:[
            {
                role:"user",
                content:userPrompt,
            }
        ]
    });

    const content = response.content.filter(
        (item)=> item.type === "text"
    ).map(
        (item)=> item.text
    ).join("\n");

    return content;
}

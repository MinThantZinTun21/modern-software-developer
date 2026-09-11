import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

const baseUrl = process.env.OMNIROUTE_BASE_URL;
const apiKey = process.env.OMNIROUTE_API_KEY;
const MODEL = process.env.MODEL ?? "auto";

const client = new Anthropic({
  baseURL: baseUrl,
  apiKey: apiKey,
});

export async function askLLM(
  systemPrompt: string,
  user: string,
  model: string = MODEL,
): Promise<string> {
  const response = await client.messages.create({
    model: model,
    system: systemPrompt,
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: user,
      },
    ],
  });

  const content = response.content.filter((item) => item.type === "text");
  return content.map((item) => item.text).join("\n");
}

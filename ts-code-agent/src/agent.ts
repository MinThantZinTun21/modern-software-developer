import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.OMNIROUTE_API_KEY;
const baseURL = process.env.OMNIROUTE_BASE_URL;
const model =
  process.env.OMNIROUTE_MODEL ??
  process.env.MODEL ??
  "auto";

if (!apiKey) {
  throw new Error("Missing OMNIROUTE_API_KEY in .env");
}

const client = new Anthropic({
  apiKey,
  baseURL,
});

export async function callModel(
  systemPrompt: string,
  prompt: string
): Promise<string> {
  const response = await client.messages.create({
    model,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const textBlock = response.content.find(
    (block) => block.type === "text"
  );

  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text block found in response");
  }

  return textBlock.text;
}

export function parseJson<T>(text: string): T {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = (fenced?.[1] ?? trimmed).trim();
  return JSON.parse(raw) as T;
}

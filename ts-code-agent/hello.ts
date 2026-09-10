import "dotenv/config";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("Missing OPENAI_API_KEY. Copy .env.example to .env and add your key.");
  process.exit(1);
}

const client = new OpenAI({ apiKey });

const response = await client.responses.create({
  model: "gpt-4.1-mini",
  input: "Say hello in one short sentence.",
});

console.log(response.output_text);

import { askLLM } from "./llm";
import { ROUTER_SYSTEM_PROMPT } from "./promts";

 export type Category =
| "GENERAL"
| "REFUND"
| "TECHNICAL"
| "COMPLEX";


export interface RouterResult {
category: Category;
reasoning: string;

}

export function extractJSON(text: string): string {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
  
    if (start === -1 || end === -1) {
      throw new Error("Router did not return JSON");
    }
  
    return text.slice(start, end + 1);
  }

  

export async function routerRequest(message:string):Promise<RouterResult>{


  const result = await askLLM(ROUTER_SYSTEM_PROMPT, message);

  try {

    const json = extractJSON(result);

    const parsed = JSON.parse(json);

    const category = parsed.category as Category;

    if (
      category !== "GENERAL" &&
      category !== "REFUND" &&
      category !== "TECHNICAL" &&
      category !== "COMPLEX"
    ) {
      throw new Error(
        `Invalid category: ${category}`
      );
    }

    return {
      category,
      reasoning: parsed.reason ?? ""
    };

  } catch (error) {

    console.error(
      "Router parsing failed:",
      result
    );

    return {
      category: "COMPLEX",
      reasoning: "Unable to classify request safely"
    };
}

}
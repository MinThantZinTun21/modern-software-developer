import { askLLM } from "./llm.js";

import {
    HATE_SPEECH_PROMPT,
    SEXUAL_CONTENT_PROMPT,
    VIOLENCE_PROMPT,
    SPAM_PROMPT,
    AGGREGATOR_PROMPT
  } from "./promts.js";




  
type Severity =
  | "NONE"
  | "LOW"
  | "MEDIUM"
  | "HIGH";

type DetectorType =
  | "HATE_SPEECH"
  | "SEXUAL_CONTENT"
  | "VIOLENCE"
  | "SPAM";


  export interface DectorResult{
    decctorType:DetectorType;
    servrity:Severity;
    flagged:boolean;
    reasoning:string;
  }

  export interface ModeratorDescision {
    decision :"ALLOW" | "BLOCK" | "REVIEW";
    reasons:string[];
  }
  function parseJSON(text: string): any {

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
  
    if (start === -1 || end === -1) {
      throw new Error(`Invalid JSON response:\n${text}`);
    }
  
    return JSON.parse(
      text.slice(start, end + 1)
    );
  }


  export async function dectionHateSpees (message:string):Promise<DectorResult>{

    const respone = await askLLM(HATE_SPEECH_PROMPT, message);
    console.log("🚨 Hate speech detector started");
    console.log("🔍 Message:", message);
    console.log("🔍 Response:", respone);
    const json = parseJSON(respone);
    console.log("🔍 JSON:", json);
    return {
      decctorType: "HATE_SPEECH",
      servrity: json.severity as Severity,
      flagged: json.flagged,
      reasoning: json.reasoning ?? json.reason
    };




  }

  export async function dectionSexualContent (message:string):Promise<DectorResult>{

    const respone = await askLLM(SEXUAL_CONTENT_PROMPT, message);
    const json = parseJSON(respone)
    console.log("🚨 Sexual content detector started");
    console.log("🔍 Message:", message);
    console.log("🔍 Response:", respone);
    console.log("🔍 JSON:", json);
        return {
      decctorType: "SEXUAL_CONTENT",
      servrity: json.severity as Severity,
      flagged: json.flagged,
      reasoning: json.reasoning ?? json.reason
    };




}

  export async function dectionViolence (message:string):Promise<DectorResult>{

    const respone = await askLLM(VIOLENCE_PROMPT, message);
    const json = parseJSON(respone);
    console.log("🚨 Violence detector started");
    console.log("🔍 Message:", message);
    console.log("🔍 Response:", respone);
    console.log("🔍 JSON:", json);
    return {
      decctorType: "VIOLENCE",
      servrity: json.severity as Severity,
      flagged: json.flagged,
      reasoning: json.reasoning ?? json.reason
    };
  }

  export async function dectionSpam (message:string):Promise<DectorResult>{
    const respone = await askLLM(SPAM_PROMPT, message);
    const json = parseJSON(respone);
    console.log("🚨 Spam detector started");
    console.log("🔍 Message:", message);
    console.log("🔍 Response:", respone);
    console.log("🔍 JSON:", json);
    return {
      decctorType: "SPAM",
      servrity: json.severity as Severity,
      flagged: json.flagged,
      reasoning: json.reasoning ?? json.reason
    };
  }

export async function moderatePost(message:string):Promise<DectorResult[]>{

    console.log("\n🚀 Running detectors in parallel...\n");
   const results = await Promise.all ([
    dectionHateSpees(message),
    dectionSexualContent(message),
    dectionViolence(message),
    dectionSpam(message)
   ]

   );

   return results;


}


export async function makeDesciton (post:string, results:DectorResult[]):Promise<ModeratorDescision>{

    const detectorResults = results
    .map(result => `
Detector: ${result.decctorType}
Flagged: ${result.flagged}
Severity: ${result.servrity}
Reason: ${result.reasoning}
`)
    .join("\n");



const response =await askLLM(AGGREGATOR_PROMPT, `
POST:

${post

}

DETECTOR RESULTS:

${detectorResults}
`);

return parseJSON(response);
}

import { askLLM } from "../llm";
import {GENERAL_SYSTEM_PROMPT, REFUND_SYSTEM_PROMPT, TECHNICAL_SYSTEM_PROMPT} from "../promts";
import { COMPLEX_SYSTEM_PROMPT } from "../promts";


export async function handleGeneral(message:string):Promise<string>{

     return askLLM(GENERAL_SYSTEM_PROMPT, message);
}

export async function handleRefund(message:string):Promise<string>{
     return askLLM(REFUND_SYSTEM_PROMPT, message);
}

export async function handleTechnical(message:string):Promise<string>{
     return askLLM(TECHNICAL_SYSTEM_PROMPT, message);
}

export async function handleComplex(message:string):Promise<string>{
     return askLLM(COMPLEX_SYSTEM_PROMPT, message);
}
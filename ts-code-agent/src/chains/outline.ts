import { callModel, parseJson } from "../agent.js";

export interface ExerciseOuline {
  title: string;
  objective: string;
  diffcultly: string;
  section: string[];
}

export async function generateOutline(
  topic: string
): Promise<ExerciseOuline> {
  const system = `
    You are an expert technical educator.
    
    Your job is to create a structured exercise outline.
    
    Return ONLY valid JSON.
    Do not use markdown.
    `;
  const promt = `
  Generate an exercise outline for the following topic:
  ${topic}
  The exercise should contain : 
   -title 
   -objective
   -difficultyl
   -sections 

   The sections should describe the progression of the exercise.

Example:

{
  "title": "Building a Prompt Chain",
  "objective": "Learn how to compose multiple LLM calls",
  "difficulty": "Intermediate",
  "sections": [
    "Understand prompt chaining",
    "Generate an outline",
    "Validate the outline",
    "Generate the final exercise"
  ]
}
  `;

  const response = await callModel(system, promt);

  return parseJson<ExerciseOuline>(response);
}

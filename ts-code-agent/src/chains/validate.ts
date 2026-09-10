import { ExerciseOuline } from "./outline.js";
import { callModel, parseJson } from "../agent.js";

export interface ValidateResult {
  valid: boolean;
  score: number;
  problems: string[];
  suggestions: string[];
}

export async function validateOutline(
  outline: ExerciseOuline
): Promise<ValidateResult> {
  const system = `
You are a strict curriculum reviewer.

Review the exercise outline against the required criteria.

Return ONLY valid JSON.
`;

  const prompt = `
Review this exercise outline:

${JSON.stringify(outline, null, 2)}

Validation criteria:

1. The objective must be clear.
2. The exercise must have a logical progression.
3. The difficulty must match the topic.
4. Sections must be actionable.
5. The exercise should be practical.
6. A learner should be able to complete it independently.

Return:

{
  "valid": true,
  "score": 0,
  "problems": [],
  "suggestions": []
}
`;

  const response = await callModel(system, prompt);
  return parseJson<ValidateResult>(response);
}

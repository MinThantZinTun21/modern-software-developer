import { callModel } from "../agent.js";
import { ExerciseOuline } from "./outline.js";
import { ValidateResult } from "./validate.js";

export async function generateExercise(
  outline: ExerciseOuline,
  validate: ValidateResult
): Promise<string> {
  const system = `
You are an expert technical instructor.

Create a complete hands-on programming exercise.

The exercise should be practical and suitable for a developer.

Do not explain your reasoning.
`;

  const prompt = `
Create the final exercise using the following outline:

${JSON.stringify(outline, null, 2)}

The outline was reviewed by another agent:

${JSON.stringify(validate, null, 2)}

Apply the review suggestions.

The final exercise must contain:

# Exercise

## Objective

## Scenario

## Requirements

## Tasks

## Expected Output

## Hints

## Bonus Challenge

Make the exercise concrete and executable.

If code is required, provide starter code but do not provide the complete solution.
`;

  return callModel(system, prompt);
}

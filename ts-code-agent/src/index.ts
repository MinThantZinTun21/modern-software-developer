import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { generateOutline } from "./chains/outline.js";
import { validateOutline } from "./chains/validate.js";
import { generateExercise } from "./chains/generate.js";

function printInternal(label: string, value: unknown) {
  console.log(`\n--- ${label} ---`);

  if (typeof value === "string") {
    console.log(value);
    return;
  }

  console.log(JSON.stringify(value, null, 2));
}

async function runChain(topic: string) {
  console.log("\n=================================");
  console.log("PROMPT CHAINING AGENT");
  console.log(`Topic: ${topic}`);
  console.log("=================================");

  console.log("\n1. Generating outline...");
  const outline = await generateOutline(topic);
  printInternal("Internal: outline", outline);

  console.log("\n2. Validating outline...");
  const validation = await validateOutline(outline);
  printInternal("Internal: validation", validation);

  console.log("\n3. Generating final exercise...");
  const exercise = await generateExercise(outline, validation);
  printInternal("Internal: final exercise", exercise);
}

async function askTopic(
  rl: readline.Interface
): Promise<string> {
  const answer = await rl.question("\x1b[94mYou\x1b[0m: ");
  return answer.trim();
}

async function main() {
  const rl = readline.createInterface({ input, output });

  console.log(`
╔══════════════════════════════════════╗
║       Prompt Chaining Agent          ║
╚══════════════════════════════════════╝

Type a topic, then press Enter.
Type exit to quit.
`);

  const fromArgs = process.argv.slice(2).join(" ").trim();

  try {
    if (fromArgs) {
      await runChain(fromArgs);
      return;
    }

    while (true) {
      const topic = await askTopic(rl);

      if (!topic || topic.toLowerCase() === "exit") {
        break;
      }

      await runChain(topic);
    }
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error("\nAgent failed:");
  console.error(error);
  process.exit(1);
});

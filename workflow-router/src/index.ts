import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { agent } from "./agent";

const rl = readline.createInterface({ input, output });

async function main() {
  console.log("Customer service agent");
  console.log('Type a message, or "exit" to quit.\n');

  while (true) {
    const message = (await rl.question("You: ")).trim();

    if (!message) {
      continue;
    }

    if (message.toLowerCase() === "exit" || message.toLowerCase() === "quit") {
      console.log("Goodbye.");
      break;
    }

    try {
      const reply = await agent(message);
      console.log(`Agent: ${reply}\n`);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      console.error(`Error: ${reason}\n`);
    }
  }

  rl.close();
}

main();

import readline from "node:readline";

import {
  moderatePost,
  makeDesciton
} from "./moderation.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "\n📝 Post > "
});

console.log(`
╔══════════════════════════════════════════════════╗
║           CONTENT MODERATION AGENT              ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  Enter a social media post to moderate.         ║
║                                                  ║
║  Commands:                                       ║
║    clear  - Clear terminal                      ║
║    exit   - Exit application                    ║
║                                                  ║
╚══════════════════════════════════════════════════╝
`);

rl.prompt();

rl.on("line", async (input) => {

  const post = input.trim();

  if (!post) {
    rl.prompt();
    return;
  }

  // EXIT
  if (post.toLowerCase() === "exit") {

    console.log("\n👋 Goodbye!");

    rl.close();
    return;
  }

  // CLEAR
  if (post.toLowerCase() === "clear") {

    console.clear();

    rl.prompt();

    return;
  }

  try {

    console.log("\n");
    console.log("════════════════════════════════════════");
    console.log("        CONTENT MODERATION");
    console.log("════════════════════════════════════════");

    console.log(`\nPost:\n"${post}"`);

    const startTime = Date.now();

    // --------------------------------
    // PARALLEL DETECTORS
    // --------------------------------

    const results = await moderatePost(post);

    const detectorTime = Date.now() - startTime;

    // --------------------------------
    // SHOW DETECTOR RESULTS
    // --------------------------------

    console.log("\n");
    console.log("📊 DETECTOR RESULTS");
    console.log("────────────────────────────────────────");

    for (const result of results) {

      console.log(`\n🔍 ${result.decctorType}`);

      console.log(
        `   Flagged : ${result.flagged}`
      );

      console.log(
        `   Severity: ${result.servrity}`
      );

      console.log(
        `   Reason  : ${result.reasoning}`
      );
    }

    console.log(
      `\n⚡ Parallel detection time: ${detectorTime}ms`
    );

    // --------------------------------
    // AGGREGATOR
    // --------------------------------

    console.log("\n🧠 Aggregating detector results...");

    const decision = await makeDesciton(
      post,
      results
    );

    // --------------------------------
    // FINAL RESULT
    // --------------------------------

    console.log("\n");
    console.log("════════════════════════════════════════");
    console.log("       FINAL MODERATION DECISION");
    console.log("════════════════════════════════════════");

    console.log(
      `\nDecision: ${decision.decision}`
    );

    console.log("\nReasons:");

    for (const reason of decision.reasons) {
      console.log(`  • ${reason}`);
    }

    console.log("\n════════════════════════════════════════");

  } catch (error) {

    console.error("\n❌ ERROR");

    console.error(
      error instanceof Error
        ? error.message
        : error
    );
  }

  rl.prompt();
});

rl.on("close", () => {
  process.exit(0);
});
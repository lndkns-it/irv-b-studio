/**
 * Worker entry point.
 *
 * This process runs long-lived background jobs (AI analysis) outside of the
 * serverless web app. The queue consumer and Claude orchestration are added
 * in Week 3.
 */

import { prisma } from "./db.js";

async function main(): Promise<void> {
  console.log("🎧 Irv. B worker is up and running.");
  console.log("   Waiting for jobs (queue consumer comes in Week 3).");

  // Keep the DB connection warm; the queue consumer will use it in Week 3.
  await prisma.$connect();
}

main().catch((error) => {
  console.error("❌ Worker failed to start:", error);
  process.exit(1);
});
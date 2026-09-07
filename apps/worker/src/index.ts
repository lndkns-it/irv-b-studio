/**
 * Worker entry point.
 *
 * Consumes track-analysis jobs from the queue and processes them. For now the
 * processing is a placeholder that simulates work; the Claude pipeline is added
 * next.
 */

import { Worker } from "bullmq";
import { ANALYSIS_QUEUE_NAME,
  getConnection,
  type AnalysisJobData,
 } from "@irv-b/queue";
import { prisma } from "@irv-b/database";

async function processJob(data: AnalysisJobData): Promise<void> {
  const { trackId } = data;
  console.log(`▶️  Processing analysis for track ${trackId}`);

  // Mark the track as processing
  await prisma.track.update({
    where: { id: trackId },
    data: { status: "PROCESSING" },
  });

  // Placeholder: simulate analysis work (replaced by claude pipeline next)
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Mark the track as done
  await prisma.track.update({
    where: { id: trackId },
    data: { status: "DONE" },
  })

  console.log(`✅ Finished analysis for track ${trackId}`);
}

async function main(): Promise<void> {
  await prisma.$connect();
  console.log("🎧 Irv. B worker is up and consuming the analysis queue.");

  const worker =  new Worker<AnalysisJobData>(
    ANALYSIS_QUEUE_NAME,
    async (job) => {
      await processJob(job.data);
    },
    { connection: getConnection() },
  );

  worker.on("completed", (job) => {
    console.log(`🟢 Job ${job.id} completed.`);
  });

  worker.on("failed", (job, err) => {
    console.error(`🔴 Job ${job?.id} failed:`, err.message);
  });
}

main().catch((error) => {
  console.error("❌ Worker failed to start:", error);
  process.exit(1);
});
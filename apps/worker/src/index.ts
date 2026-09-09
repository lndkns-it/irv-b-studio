/**
 * Worker entry point.
 *
 * Consumes track-analysis jobs from the queue, runs the Claude analysis
 * pipeline, and publishes status updates to Redis pub/sub so connected clients
 * get real-time progress.
 */

import { Worker } from "bullmq";
import { ANALYSIS_QUEUE_NAME,
  getConnection,
  createRedisConnection,
  publishTrackUpdate,
  type AnalysisJobData,
 } from "@irv-b/queue";
import { prisma } from "@irv-b/database";
import { analyzeMoodGenre } from "./analysis/mood-genre";
import { Redis } from "ioredis";
import type { TrackStatus } from "@irv-b/database";

// Dedicated connection for publishing status
const publisher: Redis = createRedisConnection();

/** Updates a track's status in the DB and publishes the change to subscribers */
async function setTrackStatus(
  trackId: string,
  userId: string,
  status: TrackStatus,
): Promise<void> {
  await prisma.track.update({
    where: { id: trackId },
    data: { status },
  });
  await publishTrackUpdate(publisher, { trackId, userId, status });
}

async function processJob(data: AnalysisJobData): Promise<void> {
  const { trackId, userId } = data;
  console.log(`▶️  Processing analysis for track ${trackId}`);

  await setTrackStatus(trackId, userId, "PROCESSING");

  // Load the track to get its title and lyrics
  const track = await prisma.track.findUnique({ where: { id: trackId }});
  if(!track) {
    throw new Error(`Track ${trackId} not found`);
  }

  // Step 1: analyze mood and genre with Claude
  const moodGenre = await analyzeMoodGenre(track.title, track.lyrics);
  console.log(`🎨 Mood: ${moodGenre.mood}, Genres: ${moodGenre.genres.join(", ")}`);

  // Mark the track as done
  await setTrackStatus(trackId, userId, "DONE");

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

  worker.on("failed", async (job, err) => {
    console.error(`🔴 Job ${job?.id} failed:`, err.message);
    // If we know which track failed, mark it as ERROR and notify
    if (job?.data) {
      const { trackId, userId } = job.data;
      await setTrackStatus(trackId, userId, "ERROR").catch(() => {});
    }
  });
}

main().catch((error) => {
  console.error("❌ Worker failed to start:", error);
  process.exit(1);
});
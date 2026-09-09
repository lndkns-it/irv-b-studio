import { Queue, type ConnectionOptions } from "bullmq";
import { Redis } from "ioredis";

/**
 * Shared queue definitions for Irv. B Music Studio.
 *
 * This package centralizes the queue name, its job payload contract, and the
 * Redis connection, so the producer (web) and the consumer (worker) can never
 * disagree about the shape of a job.
 */

/** the single queue used for track analysus jobs. */
export const ANALYSIS_QUEUE_NAME = "track-analysis";

/** The payload contract for an analysis job - the single source of truth. */
export interface AnalysisJobData {
    trackId: string;
    userId: string;
}

/**
 * Builds the Redis connection options from the REDIS_URL environment variable.
 * BullMQ requires `maxRetriesPerRequest: null` for its blocking operations.
 */
export function getConnection(): ConnectionOptions {
    const url = process.env.REDIS_URL;
    if(!url) {
        throw new Error("REDIS_URL environment variable is not set");
    }
    return {
        url,
        maxRetriesPerRequest: null,
    } as ConnectionOptions
}

/**
 * Creates a Queue instance for producing jobs (used by the web app).
 * The worker consumes with its own Worker instance, defined separately.
 */
export function createAnalysisQueue(): Queue<AnalysisJobData> {
    return new Queue<AnalysisJobData>(ANALYSIS_QUEUE_NAME, {
        connection: getConnection(),
    });
}

/** The redis channel for track status updates */
export const TRACK_UPDATES_CHANNEL = "track_updates";

/** The payload published when a track's status changes. */
export interface TrackUpdateMessage {
    trackId: string;
    userId: string;
    status: string;
}

/**
 * Creates a raw ioredis connection. Used for pub/sub, which needs a dedicated
 * connection (a subscribed connection cannot run other commands).
 */
export function createRedisConnection(): Redis {
    const url = process.env.REDIS_URL;
    if(!url) {
        throw new Error("REDIS_URL environment vriable is not set");
    }
    return new Redis(url, { maxRetriesPerRequest: null});
}

/**
 * Publishes a track status update to the pub/sub channel. Called by the worker
 * whenever a track changes state, so subscribers (the SSE endpoint) are notified
 * in real time.
 */
export async function publishTrackUpdate(
    publisher: Redis,
    message: TrackUpdateMessage,
): Promise<void> {
    await publisher.publish(TRACK_UPDATES_CHANNEL, JSON.stringify(message));
}

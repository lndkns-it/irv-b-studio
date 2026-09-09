import { getCurrentUser } from "@/lib/session";
import {
    createRedisConnection,
    TRACK_UPDATES_CHANNEL,
    type TrackUpdateMessage,
} from "@irv-b/queue";

/**
 * GET /api/tracks/events
 *
 * Server-Sent Events endpoint. Subscribes to the Redis track-updates channel
 * and streams status changes to the browser in real time. Each user only
 * receives updates for their own tracks.
 */
export async function GET() {
    const user = await getCurrentUser();
    if(!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    // A dedicated Redis connection for subscribing (a subscribed connection
    // cannot run other commands, so it must be its own connection).
    const subscriber = createRedisConnection();

    const stream = new ReadableStream({
        start(controller) {
            const encoder =  new TextEncoder();

            // Helper to send an SSE-formatted message
            const send = (data: string) => {
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            };

            // Subscribe to the channel
            subscriber.subscribe(TRACK_UPDATES_CHANNEL);

            // On each published message, forward it to this user's browser
            subscriber.on("message", (_channel, message) => {
                try {
                    const update = JSON.parse(message) as TrackUpdateMessage;
                    // Only forward updates for THIS user's tracks
                    if (update.userId === user.id) {
                        send(message);
                    }
                } catch {
                    // Ingnore malformed messages
                }
            });

            // CLean up when the client disconnects
            return () => {
                subscriber.unsubscribe(TRACK_UPDATES_CHANNEL);
                subscriber.quit();
            };
        },
        cancel() {
            subscriber.unsubscribe(TRACK_UPDATES_CHANNEL);
            subscriber.quit();
        }
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
        },
    });
}
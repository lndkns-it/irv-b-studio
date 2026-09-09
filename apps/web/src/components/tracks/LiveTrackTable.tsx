"use client";

import { useState, useEffect } from "react";
import { type Track } from "@irv-b/database";
import { TrackTable } from "./TrackTable";

/**
 * LiveTrackTable — client container that keeps the track list in sync with
 * real-time status updates from the SSE endpoint.
 *
 * It receives the initial tracks (rendered on the server) and updates their
 * status live as the worker processes them, without a page reload.
 */

interface LiveTrackTableProps {
    initialTracks: Track[];
}

export function LiveTrackTable({ initialTracks }: LiveTrackTableProps ) {
    const [tracks, setTracks] = useState(initialTracks);

    useEffect(() => {
        const eventSource = new EventSource("/api/tracks/events");

        eventSource.onmessage = (event) => {
            try {
                const update = JSON.parse(event.data) as {
                    trackId: string;
                    status: Track["status"];
                };
                // Update the matching track's status in place
                setTracks((prev) => 
                    prev.map((track) => 
                        track.id === update.trackId
                            ? { ...track, status: update.status }
                            : track,
                    ),
                );
            } catch {
                // Ignore malformed events
            }
        };

        // Clean up the connection when the component unmounts
        return () => {
            eventSource.close();
        };
    }, []);

    return <TrackTable tracks={tracks} />;
}
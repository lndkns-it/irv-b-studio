import { TrackStatus } from "@irv-b/database";

/**
 * Maps a track's processing status to its badge variant and human-readable
 * label. Centralizing this keeps status presentation consistent everywhere.
 */
export function getStatusPresentation(status: TrackStatus): {
    variant: "neutral" | "info" | "success" | "danger";
    label: string;
} {
    switch (status) {
        case "QUEUED":
            return { variant: "neutral", label: "Queued" };
        case "PROCESSING":
            return { variant: "info", label: "Processing" };
        case "DONE":
            return { variant: "success", label: "Done" };
        case "ERROR":
            return { variant: "danger", label: "Error" };
    }
}
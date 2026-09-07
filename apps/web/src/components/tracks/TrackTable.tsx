import { type Track } from "@irv-b/database";
import { Badge } from "../ui/Badge";
import { getStatusPresentation } from "@/lib/track-status";

/**
 * TrackTable — presentational component.
 *
 * Renders the user's tracks as a semantic, accessible table. It's a pure
 * presentational component: it receives data and renders it, holding no
 * fetching logic of its own.
 */

interface TrackTableProps {
    tracks: Track[];
}

export function TrackTable({ tracks }: TrackTableProps) {
    if (tracks.length === 0) {
        return (
            <div className="text-center py-12 text-content-muted">
                <p className="text-lg font-medium mb-1">No tracks yet</p>
                <p className="text-sm">Upload your first track to get started</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
                <caption className="sr-only">Your uploaded tracks</caption>
                <thead>
                    <tr className="border-b border-border bg-surface-sunken">
                        <th scope="col" className="text-left font-semibold text-content px-4 py-3">
                            Title
                        </th>
                        <th scope="col" className="text-left font-semibold text-content px-4 py-3">
                            Status
                        </th>
                        <th scope="col" className="text-left font-semibold text-content px-4 py-3">
                            Uploaded
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tracks.map((track) => {
                        const status = getStatusPresentation(track.status);
                        return (
                            <tr
                                key={track.id}
                                className="border-b border-border last:border-0 hover:bg-surface-muted"
                            >
                                <th scope="row" className="text-left font-medium text-content px-4 py-3">
                                    {track.title}
                                </th>
                                <td className="px-4py-3">
                                    <Badge variant={status.variant}>{status.label}</Badge>
                                </td>
                                <td className="px-4 py-3 text-content-muted">
                                    {new Date(track.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
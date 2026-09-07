import { NextResponse } from "next/server";
import { prisma } from "@irv-b/database";
import { createAnalysisQueue } from "@irv-b/queue";
import { getCurrentUser } from "@/lib/session";

/**
 * POST /api/tracks
 *
 * Creates a track record after its audio has been uploaded to S3, then enqueues
 * an analysis job for the worker to process.
 */
export async function POST(request: Request) {
    const user = await getCurrentUser();
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

    const body = await request.json();
    const { title, audioKey, lyrics } = body;

    if (typeof title !== "string" || title.trim().length === 0) {
        return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (typeof audioKey !== "string" || audioKey.length === 0) {
        return NextResponse.json({ error: "Audio key is required" }, { status: 400 });
    }


    const track =  await prisma.track.create({
        data: {
            userId: user.id,
            title: title.trim(),
            audioUrl: audioKey,
            lyrics: typeof lyrics == "string" ? lyrics : null,
        },
    });

    const queue = createAnalysisQueue();
    await queue.add("analyze", { trackId: track.id, userId: user.id});
    await queue.close();

    return NextResponse.json({ track }, { status: 201 });
}

/**
 * GET /api/tracks
 *
 * Returns the authenticated user's tracks, newest first.
 */
export async function GET() {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tracks = await prisma.track.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tracks });
}

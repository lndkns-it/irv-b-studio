import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { createUploadUrl } from "@/lib/s3";
import { randomUUID } from "crypto";

/**
 * POST /api/tracks/upload-url
 *
 * Returns a presigned URL the client uses to upload an audio file directly to
 * S3. Requires authentication. The generated object key is namespaced by user
 * so uploads are isolated per account.
 */
export async function POST(request: Request) {
	// 1. Require authentication
	const user = await getCurrentUser();
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	// 2. Read and validate the requested file metadata
	const body = await request.json()
	const { fileName, contentType } = body;

	if(typeof fileName !== "string" || typeof contentType !== "string") {
		return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
	}

	// 3. Only allow audio files
	if(!contentType.startsWith("audio/")) {
		return NextResponse.json(
			{ error: "Only audio files are allowed" },
			{ status: 400 }
		);
	}

	// 4. Build a unique, user-namespaced object key
	const key = `uploads/${user.id}/${randomUUID}-${fileName}`;

	// 5. Generate the presigned upload URL
	const uploadUrl = await createUploadUrl(key, contentType);

	return NextResponse.json({ uploadUrl, key });
}
"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

/**
 * Track upload page.
 *
 * Orchestrates the direct-to-S3 upload flow:
 *   1. Request a presigned URL from the backend.
 *   2. Upload the file straight to S3 with that URL.
 *   3. Create the track record in the database.
 */
export default function UploadPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [lyrics, setLyrics] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] =  useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "uploading" | "saving">("idle");

    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        setError(null);

        if(!file) {
            setError("Please choose an audio file");
            return;
        }
        if(title.trim().length === 0) {
            setError("Please enter a title");
            return;
        }

        try {
            setStatus("uploading");
            const urlRes = await fetch("/api/tracks/upload-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileName: file.name, contentType: file.type }),
            });
            if(!urlRes.ok) throw new Error("Could not get upload URL");
            const { uploadUrl, key } = await urlRes.json();

            const uploadRes = await fetch(uploadUrl, {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: file,
            });
            if(!uploadRes.ok) throw new Error("Upload to storage failed");

            setStatus("saving");
            const trackRes = await fetch("/api/tracks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, audioKey: key, lyrics}),
            });
            if(!trackRes.ok) throw new Error("Could not save track");

            router.push("/dashboard");
            router.refresh();
        } catch(err) {
            setError(err instanceof Error ? err.message :  "Something went wrong");
            setStatus("idle");
        }
    }

    const busy = status !== "idle";

    return (
        <main className="min-h-screen p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-content mb-6">Upload a track</h1>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <div>
                    <Label htmlFor="title" required>
                        Title
                    </Label>
                    <Input 
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="audio" required>
                        Audio file
                    </Label>
                    <input
                        id="audio"
                        type="file"
                        accept="audio/*"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        className="block w-full text-sm text-content-muted file:mr-4 file:py-2 file:rounded-md file:border-0 file:bg-brand-600 file:text-white file:cursor-pointer hover:file:bg-brand-700"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="lyrics">Lyrics</Label>
                    <textarea 
                        id="lyrics"
                        value={lyrics}
                        onChange={(e) => setLyrics(e.target.value)}
                        rows={6}
                        placeholder="Optional"
                        className="w-full px-3 py-2 rounded-md border border-border bg-surface text-content placeholder:text-content-subtle"
                    />
                </div>

                {error && (
                    <p role="alert" className="text-sm text-danger">
                        {error}
                    </p>
                )}

                <Button type="submit" disabled={busy}>
                    {status === "uploading"
                        ? "Uploading..."
                        : status === "saving" 
                            ? "Saving..."
                            : "Upload track"
                    }
                </Button>
            </form>
        </main>
    );
}
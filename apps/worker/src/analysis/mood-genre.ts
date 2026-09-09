import { claude, ANALYSIS_MODEL } from "../claude.js";
import { moodGenreSchema, type MoodGenreResult } from "./schema.js";

/**
 * Analysis step 1: determine the mood and genres of a track from its lyrics.
 *
 * Uses Claude with a strict instruction to return JSON only, then validates the
 * response against the schema. Returns typed, trustworthy data.
 */
export async function analyzeMoodGenre(
    title: string,
    lyrics: string | null,
): Promise<MoodGenreResult> {
    const message = await claude.messages.create({
        model: ANALYSIS_MODEL,
        max_tokens: 512,
        system:
            "You are a music A&R analyst. Analyze the track and respond with ONLY a " +
            "valid JSON object, no markdown, no explanation. The JSON must have this " +
            'shape: {"mood": string, "genres": string[]}. "mood" is one or two words. ' +
            '"genres" is 1 to 3 genres, most likely first.',
        messages: [
            {
                role: "user",
                content: `Title: ${title}\n\nLyrics:\n${lyrics ?? "(no lyrics provided)"}`,
            },
        ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if(!textBlock || textBlock.type !== "text") {
        throw new Error("Claude returned no text content");
    }

    // Parse and validate against the schema
    const parsed = JSON.parse(textBlock.text);
    return moodGenreSchema.parse(parsed);
}
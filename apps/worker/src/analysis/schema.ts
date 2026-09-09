import { z } from "zod";

/**
 * Structured output schemas for the analysis pipeline.
 *
 * Each schema defines the exact shape we require from Claude. The model's
 * response is validated against these before use, so malformed output is caught
 * and never trusted blindly.
 */

export const moodGenreSchema = z.object({
    mood: z.string().describe("One or two words capturing the overall mood"),
    genres: z
        .array(z.string())
        .min(1)
        .max(3)
        .describe("Up to three musical genres, most likely first"),
});

export type MoodGenreResult = z.infer<typeof moodGenreSchema>;
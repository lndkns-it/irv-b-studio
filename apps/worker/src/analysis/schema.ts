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

export const themesSchema = z.object({
    themes: z
        .array(
            z.object({
                theme: z.string().describe("A short theme name"),
                confidence: z
                    .number()
                    .min(0)
                    .max(1)
                    .describe("Confidence from 0 to 1"),
            }),
        )
        .max(5)
        .describe("Up to five lyrical themes"),
});

export const metadataSchema = z.object({
    distributionTags: z
        .array(z.string())
        .max(8)
        .describe("Tags for distribution platforms"),
    description: z
        .string()
        .max(500)
        .describe("A short marketing description of the track"),
});

export type MoodGenreResult = z.infer<typeof moodGenreSchema>;
export type ThemesResult = z.infer<typeof themesSchema>;
export type MetadataResult = z.infer<typeof metadataSchema>;

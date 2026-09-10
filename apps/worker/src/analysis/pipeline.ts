import { runAnalysisStep } from "./run-step";
import { moodGenreSchema, themesSchema, metadataSchema } from "./schema";

/**
 * The full analysis pipeline: three focused steps run in sequence, each
 * producing validated structured output. Kept as separate steps (not one big
 * prompt) for reliability, debuggability, and cost control.
 */

export interface AnalysisResult {
    mood: string;
    genres: string[];
    themes: { theme: string; confidence: number }[];
    distributionTags: string[];
    description: string;
}

export async function runAnalysisPipeline(
    title: string,
    lyrics: string | null,
): Promise<AnalysisResult> {
    const trackContext = `Title: ${title}\n\nLyrics:\n${lyrics ?? "(no lyrics provided)"}`;

    // Step 1: mood and genre
    const moodGenre = await runAnalysisStep(
        "You are a music A&R analyst. Respond with ONLY valid JSON, no markdown. " +
        'Shape: {"mood": string, "genres": string[]}. mood is one or two words; ' +
        "genres is 1 to 3, most likely first.",
        trackContext,
        moodGenreSchema,
    );

    // Step 2: lyrical themes
    const themesResult = await runAnalysisStep(
        "You are a music A&R analyst. Respond with ONLY valid JSON, no markdown. " +
        'Shape: {"themes": [{"theme": string, "confidence": number}]}. Up to 5 ' +
        "themes; confidence is 0 to 1.",
        trackContext,
        themesSchema,
    );

    // Step 3: distribution metadata
    const metadata = await runAnalysisStep(
        "You are a music distribution expert. Respond with ONLY valid JSON, no " +
        'markdown. Shape: {"distributionTags": string[], "description": string}. ' +
        "Up to 8 tags; description under 500 characters.",
        `${trackContext}\n\nMood: ${moodGenre.mood}\nGenres: ${moodGenre.genres.join(", ")}`,
        metadataSchema,
    );

    return {
        mood: moodGenre.mood,
        genres: moodGenre.genres,
        themes: themesResult.themes,
        distributionTags: metadata.distributionTags,
        description: metadata.description,
    };
}
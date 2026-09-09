import Anthropic from "@anthropic-ai/sdk";

/**
 * Anthropic (Claude) client.
 *
 * Centralizes SDK configuration. The API key lives only in the worker's
 * environment — it never reaches the client or the web app.
 */

const apiKey = process.env.ANTHROPIC_API_KEY;

if(!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
}

export const claude = new Anthropic({ apiKey });

/** The model used for analysis. */
export const ANALYSIS_MODEL = "claude-sonnet-5";
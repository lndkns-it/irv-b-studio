import type { ZodType } from "zod";
import { claude, ANALYSIS_MODEL } from "../claude.js";

/**
 * Runs a single analysis step against Claude and validates the structured
 * output against a schema. Shared by all pipeline steps so the call, parse, and
 * validation logic lives in one place.
 */
export async function runAnalysisStep<T>(
  systemPrompt: string,
  userContent: string,
  schema: ZodType<T>,
): Promise<T> {
  const message = await claude.messages.create({
    model: ANALYSIS_MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: userContent }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude returned no text content");
  }

  const parsed = JSON.parse(textBlock.text);
  return schema.parse(parsed);
}

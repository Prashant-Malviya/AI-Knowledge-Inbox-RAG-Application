import OpenAI from "openai";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { ScoredChunk } from "../types";

let client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!client) client = new OpenAI({ apiKey: env.openaiApiKey });
  return client;
}

function buildPrompt(question: string, chunks: ScoredChunk[]): string {
  const context = chunks
    .map((chunk, i) => `[${i + 1}] ${chunk.text}`)
    .join("\n\n");

  return [
    "You are a precise assistant answering questions using ONLY the context below.",
    "If the context does not contain enough information to answer, say so explicitly instead of guessing.",
    "When you use a piece of context, cite it inline with its bracket number, e.g. [1].",
    "",
    "Context:",
    context,
    "",
    `Question: ${question}`,
  ].join("\n");
}


export async function generateAnswer(
  question: string,
  chunks: ScoredChunk[]
): Promise<{ answer: string; usedFallback: boolean }> {
  if (chunks.length === 0) {
    return {
      answer: "I couldn't find any saved content relevant to that question yet. Try adding a note or URL first.",
      usedFallback: !env.isAiConfigured,
    };
  }

  if (!env.isAiConfigured) {
    logger.warn("OPENAI_API_KEY not set — returning extractive fallback answer, not an LLM response");
    const extractive = chunks
      .slice(0, 3)
      .map((c, i) => `[${i + 1}] ${c.text.slice(0, 240)}${c.text.length > 240 ? "…" : ""}`)
      .join("\n\n");
    return {
      answer: `(No LLM configured — showing the most relevant excerpts instead.)\n\n${extractive}`,
      usedFallback: true,
    };
  }

  const prompt = buildPrompt(question, chunks);
  try {
    const completion = await getClient().chat.completions.create({
      model: env.chatModel,
      messages: [
        { role: "system", content: "You answer strictly from provided context and cite sources by bracket number." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 500,
    });
    const answer = completion.choices[0]?.message?.content?.trim() || "No answer generated.";
    return { answer, usedFallback: false };
  } catch (err) {
    const detail = err instanceof Error ? err.message : "unknown error";
    logger.error("Chat completion request failed", { detail });
   
    
    const extractive = chunks
      .slice(0, 3)
      .map((c, i) => `[${i + 1}] ${c.text.slice(0, 240)}`)
      .join("\n\n");
    return {
      answer: `(LLM call failed, showing relevant excerpts instead: ${detail})\n\n${extractive}`,
      usedFallback: true,
    };
  }
}

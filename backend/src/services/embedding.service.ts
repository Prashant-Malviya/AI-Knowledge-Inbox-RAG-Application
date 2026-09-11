import OpenAI from "openai";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { UpstreamServiceError } from "../utils/errors";

const FALLBACK_DIM = 256;

let client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!client) client = new OpenAI({ apiKey: env.openaiApiKey });
  return client;
}

//embedings
function localHashEmbedding(text: string): number[] {
  const vector = new Array<number>(FALLBACK_DIM).fill(0);
  const words = text.toLowerCase().match(/[a-z0-9]+/g) || [];
  for (const word of words) {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = (hash * 31 + word.charCodeAt(i)) >>> 0;
    }
    vector[hash % FALLBACK_DIM] += 1;
  }
  const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vector.map((v) => v / magnitude);
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  if (!env.isAiConfigured) {
    logger.warn("OPENAI_API_KEY not set — using local hash-based fallback embeddings", {
      count: texts.length,
    });
    return texts.map(localHashEmbedding);
  }

  try {
    const response = await getClient().embeddings.create({
      model: env.embeddingModel,
      input: texts,
    });
    return response.data
      .sort((a, b) => a.index - b.index)
      .map((item) => item.embedding);
  } catch (err) {
    const detail = err instanceof Error ? err.message : "unknown error";
    logger.error("Embedding request failed", { detail });
    throw new UpstreamServiceError(`Embedding provider error: ${detail}`);
  }
}

export async function embedText(text: string): Promise<number[]> {
  const [embedding] = await embedTexts([text]);
  return embedding;
}

import { env } from "../config/env";
import { embedText } from "./embedding.service";
import { vectorStore } from "./vectorStore.service";
import { itemStore } from "./itemStore.service";
import { generateAnswer } from "./llm.service";
import { QueryResult, QuerySource } from "../types";
import { ValidationError } from "../utils/errors";
import { logger } from "../utils/logger";

//RAG Pipeline

export async function answerQuestion(question: string, topK: number = env.topK): Promise<QueryResult> {
  const trimmed = question.trim();
  if (!trimmed) throw new ValidationError('"question" is required and cannot be empty.');
  if (trimmed.length > 2000) throw new ValidationError('"question" is too long (max 2000 characters).');

  const questionEmbedding = await embedText(trimmed);
  const topChunks = vectorStore.search(questionEmbedding, topK);

  logger.info("RAG retrieval complete", { question: trimmed, retrieved: topChunks.length, topK });

  const { answer, usedFallback } = await generateAnswer(trimmed, topChunks);

  const sources: QuerySource[] = topChunks.map((chunk) => {
    const item = itemStore.getById(chunk.itemId);
    return {
      itemId: item.id,
      title: item.title,
      sourceType: item.type,
      sourceUrl: item.sourceUrl,
      chunkIndex: chunk.chunkIndex,
      snippet: chunk.text.slice(0, 300),
      score: Number(chunk.score.toFixed(4)),
    };
  });

  return { answer, sources, usedFallbackAi: usedFallback };
}

import dotenv from "dotenv";

dotenv.config();

function toInt(value: string | undefined, fallback: number): number {
  const parsed = value ? parseInt(value, 10) : NaN;
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const env = {
  port: toInt(process.env.PORT, 4000),
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",

  openaiApiKey: process.env.OPENAI_API_KEY || "",
  embeddingModel: process.env.EMBEDDING_MODEL || "text-embedding-3-small",
  chatModel: process.env.CHAT_MODEL || "gpt-4o-mini",

  chunkSize: toInt(process.env.CHUNK_SIZE, 800),
  chunkOverlap: toInt(process.env.CHUNK_OVERLAP, 120),
  topK: toInt(process.env.TOP_K, 5),

  isAiConfigured: Boolean(process.env.OPENAI_API_KEY),
};

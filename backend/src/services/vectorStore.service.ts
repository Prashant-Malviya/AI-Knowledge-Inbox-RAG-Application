import { ChunkWithEmbedding, ScoredChunk } from "../types";

//In memory vectore store

class InMemoryVectorStore {
  private chunks: ChunkWithEmbedding[] = [];

  add(chunks: ChunkWithEmbedding[]): void {
    this.chunks.push(...chunks);
  }

  removeByItem(itemId: string): void {
    this.chunks = this.chunks.filter((c) => c.itemId !== itemId);
  }

  size(): number {
    return this.chunks.length;
  }

  search(queryEmbedding: number[], topK: number): ScoredChunk[] {
    const scored = this.chunks.map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK).map(({ embedding, ...rest }) => rest);
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export const vectorStore = new InMemoryVectorStore();

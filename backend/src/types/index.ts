export type SourceType = "note" | "url";


export interface KnowledgeItem {
  id: string;
  type: SourceType;
  title: string;
  content: string;
  sourceUrl?: string;
  createdAt: string;
  chunkCount: number;
  contentLength: number;
}


export interface Chunk {
  id: string;
  itemId: string;
  chunkIndex: number;
  text: string;
}

export interface ChunkWithEmbedding extends Chunk {
  embedding: number[];
}

export interface ScoredChunk extends Chunk {
  score: number;
}

export interface QuerySource {
  itemId: string;
  title: string;
  sourceType: SourceType;
  sourceUrl?: string;
  chunkIndex: number;
  snippet: string;
  score: number;
}

export interface QueryResult {
  answer: string;
  sources: QuerySource[];
  usedFallbackAi: boolean;
}


export interface IngestNoteRequest {
  type: "note";
  content: string;
  title?: string;
}

export interface IngestUrlRequest {
  type: "url";
  url: string;
  title?: string;
}

export type IngestRequest = IngestNoteRequest | IngestUrlRequest;

export interface QueryRequest {
  question: string;
  topK?: number;
}

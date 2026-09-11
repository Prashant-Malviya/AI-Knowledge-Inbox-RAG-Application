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

export interface ApiErrorShape {
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}

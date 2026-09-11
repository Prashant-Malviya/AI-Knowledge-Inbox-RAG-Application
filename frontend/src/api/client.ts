import { ApiErrorShape, KnowledgeItem, QueryResult } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

class ApiError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiErrorShape | null;
    const message = body?.error?.message || `Request failed with status ${res.status}`;
    throw new ApiError(message, body?.error?.code || "UNKNOWN_ERROR");
  }

  return res.json() as Promise<T>;
}

export const api = {
  ingestNote: (content: string, title?: string) =>
    request<{ item: KnowledgeItem }>("/ingest", {
      method: "POST",
      body: JSON.stringify({ type: "note", content, title }),
    }),

  ingestUrl: (url: string, title?: string) =>
    request<{ item: KnowledgeItem }>("/ingest", {
      method: "POST",
      body: JSON.stringify({ type: "url", url, title }),
    }),

  listItems: () => request<{ items: KnowledgeItem[]; count: number }>("/items"),

  query: (question: string, topK?: number) =>
    request<QueryResult>("/query", {
      method: "POST",
      body: JSON.stringify({ question, topK }),
    }),
};

export { ApiError };

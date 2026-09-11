import { v4 as uuid } from "uuid";
import { itemStore } from "./itemStore.service";
import { vectorStore } from "./vectorStore.service";
import { chunkText } from "./chunking.service";
import { embedTexts } from "./embedding.service";
import { fetchUrlContent } from "../utils/fetchUrl";
import { logger } from "../utils/logger";
import { ValidationError } from "../utils/errors";
import { ChunkWithEmbedding, IngestNoteRequest, IngestUrlRequest, KnowledgeItem } from "../types";

async function storeItemWithChunks(
  item: KnowledgeItem,
  content: string
): Promise<KnowledgeItem> {
  const chunks = chunkText(content);
  if (chunks.length === 0) {
    throw new ValidationError("Content produced no usable text chunks after processing.");
  }

  const embeddings = await embedTexts(chunks);
  const chunkRecords: ChunkWithEmbedding[] = chunks.map((text, index) => ({
    id: uuid(),
    itemId: item.id,
    chunkIndex: index,
    text,
    embedding: embeddings[index],
  }));

  item.chunkCount = chunkRecords.length;
  itemStore.add(item);
  vectorStore.add(chunkRecords);

  logger.info("Item ingested", {
    itemId: item.id,
    type: item.type,
    chunkCount: item.chunkCount,
    contentLength: item.contentLength,
  });

  return item;
}

export async function ingestNote(req: IngestNoteRequest): Promise<KnowledgeItem> {
  const content = req.content?.trim();
  if (!content) throw new ValidationError('"content" is required for note ingestion and cannot be empty.');
  if (content.length > 50000) throw new ValidationError('"content" is too long (max 50,000 characters).');

  const item: KnowledgeItem = {
    id: uuid(),
    type: "note",
    title: req.title?.trim() || content.slice(0, 60) + (content.length > 60 ? "…" : ""),
    content,
    createdAt: new Date().toISOString(),
    chunkCount: 0,
    contentLength: content.length,
  };

  return storeItemWithChunks(item, content);
}

export async function ingestUrl(req: IngestUrlRequest): Promise<KnowledgeItem> {
  const url = req.url?.trim();
  if (!url) throw new ValidationError('"url" is required for URL ingestion.');

  const { title, text } = await fetchUrlContent(url);

  const item: KnowledgeItem = {
    id: uuid(),
    type: "url",
    title: req.title?.trim() || title,
    content: text,
    sourceUrl: url,
    createdAt: new Date().toISOString(),
    chunkCount: 0,
    contentLength: text.length,
  };

  return storeItemWithChunks(item, text);
}

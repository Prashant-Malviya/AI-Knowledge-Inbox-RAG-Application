import { env } from "../config/env";

//chunking

function splitIntoSentences(text: string): string[] {
  // Simple sentence boundary heuristic: split after ./!/? followed by
  // whitespace, but keep the punctuation attached to the sentence.
  const matches = text.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g);
  return (matches || [text]).map((s) => s.trim()).filter(Boolean);
}

export function chunkText(
  text: string,
  chunkSize: number = env.chunkSize,
  overlap: number = env.chunkOverlap
): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];
  if (normalized.length <= chunkSize) return [normalized];

  const sentences = splitIntoSentences(normalized);
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const candidate = current ? `${current} ${sentence}` : sentence;

    if (candidate.length > chunkSize && current) {
      chunks.push(current.trim());
      // Start next chunk with the tail of the previous one for overlap.
      const overlapText = current.slice(Math.max(0, current.length - overlap));
      current = `${overlapText} ${sentence}`.trim();
    } else {
      current = candidate;
    }

    // Defensive: a single sentence longer than chunkSize gets hard-sliced.
    while (current.length > chunkSize * 1.5) {
      chunks.push(current.slice(0, chunkSize).trim());
      current = current.slice(chunkSize - overlap);
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

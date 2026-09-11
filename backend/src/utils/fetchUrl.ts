import axios from "axios";
import * as cheerio from "cheerio";
import { UpstreamServiceError, ValidationError } from "./errors";

const MAX_CONTENT_CHARS = 20000; 
const FETCH_TIMEOUT_MS = 10000;

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}


export async function fetchUrlContent(url: string): Promise<{ title: string; text: string }> {
  if (!isValidHttpUrl(url)) {
    throw new ValidationError(`Invalid URL: "${url}". Must be a full http(s) URL.`);
  }

  let html: string;
  try {
    const response = await axios.get<string>(url, {
      timeout: FETCH_TIMEOUT_MS,
      responseType: "text",
      headers: { "User-Agent": "ai-knowledge-inbox/1.0 (+content ingestion bot)" },
      maxContentLength: 5 * 1024 * 1024, // 5MB cap
    });
    html = response.data;
  } catch (err) {
    const detail = err instanceof Error ? err.message : "unknown error";
    throw new UpstreamServiceError(`Failed to fetch URL "${url}": ${detail}`);
  }

  const $ = cheerio.load(html);
  $("script, style, nav, footer, noscript, svg, iframe").remove();

  const title = $("title").first().text().trim() || url;
  const text = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_CONTENT_CHARS);

  if (!text) {
    throw new ValidationError(`No readable text content found at "${url}".`);
  }

  return { title, text };
}

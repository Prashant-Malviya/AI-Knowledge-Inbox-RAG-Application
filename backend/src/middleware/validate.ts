import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../utils/errors";

//validators.
export function validateIngestBody(req: Request, _res: Response, next: NextFunction): void {
  const body = req.body as Record<string, unknown>;

  if (!body || typeof body !== "object") {
    throw new ValidationError("Request body must be a JSON object.");
  }
  if (body.type !== "note" && body.type !== "url") {
    throw new ValidationError('"type" must be either "note" or "url".');
  }
  if (body.type === "note" && typeof body.content !== "string") {
    throw new ValidationError('"content" (string) is required when type is "note".');
  }
  if (body.type === "url" && typeof body.url !== "string") {
    throw new ValidationError('"url" (string) is required when type is "url".');
  }
  if (body.title !== undefined && typeof body.title !== "string") {
    throw new ValidationError('"title" must be a string if provided.');
  }

  next();
}

export function validateQueryBody(req: Request, _res: Response, next: NextFunction): void {
  const body = req.body as Record<string, unknown>;

  if (!body || typeof body !== "object") {
    throw new ValidationError("Request body must be a JSON object.");
  }
  if (typeof body.question !== "string" || !body.question.trim()) {
    throw new ValidationError('"question" (non-empty string) is required.');
  }
  if (body.topK !== undefined && (typeof body.topK !== "number" || body.topK < 1 || body.topK > 20)) {
    throw new ValidationError('"topK" must be a number between 1 and 20 if provided.');
  }

  next();
}

import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { validateIngestBody } from "../middleware/validate";
import { ingestNote, ingestUrl } from "../services/ingestion.service";
import { IngestRequest } from "../types";

export const ingestRouter = Router();

ingestRouter.post(
  "/",
  validateIngestBody,
  asyncHandler(async (req, res) => {
    const body = req.body as IngestRequest;

    const item = body.type === "note" ? await ingestNote(body) : await ingestUrl(body);

    res.status(201).json({ item });
  })
);

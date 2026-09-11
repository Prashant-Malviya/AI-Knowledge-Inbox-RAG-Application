import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { validateQueryBody } from "../middleware/validate";
import { answerQuestion } from "../services/rag.service";
import { QueryRequest } from "../types";

export const queryRouter = Router();

queryRouter.post(
  "/",
  validateQueryBody,
  asyncHandler(async (req, res) => {
    const { question, topK } = req.body as QueryRequest;
    const result = await answerQuestion(question, topK);
    res.status(200).json(result);
  })
);

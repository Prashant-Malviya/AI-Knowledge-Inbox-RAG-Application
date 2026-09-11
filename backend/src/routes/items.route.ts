import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { itemStore } from "../services/itemStore.service";

export const itemsRouter = Router();

itemsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const items = itemStore.getAll();
    res.status(200).json({ items, count: items.length });
  })
);

itemsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const item = itemStore.getById(req.params.id);
    res.status(200).json({ item });
  })
);

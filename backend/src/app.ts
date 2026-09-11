import express, { Express } from "express";
import cors from "cors";
import { env } from "./config/env";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { ingestRouter } from "./routes/ingest.route";
import { itemsRouter } from "./routes/items.route";
import { queryRouter } from "./routes/query.route";
import { itemStore } from "./services/itemStore.service";
import { vectorStore } from "./services/vectorStore.service";

export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: env.clientOrigin }));
  app.use(express.json({ limit: "1mb" }));
  app.use(requestLogger);

  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      itemCount: itemStore.count(),
      chunkCount: vectorStore.size(),
      aiConfigured: env.isAiConfigured,
    });
  });

  app.use("/ingest", ingestRouter);
  app.use("/items", itemsRouter);
  app.use("/query", queryRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

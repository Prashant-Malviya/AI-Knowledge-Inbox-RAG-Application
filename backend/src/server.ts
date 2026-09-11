import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";

const app = createApp();

app.listen(env.port, () => {
  logger.info("Server started", {
    port: env.port,
    aiConfigured: env.isAiConfigured,
    clientOrigin: env.clientOrigin,
  });
  if (!env.isAiConfigured) {
    logger.warn(
      "OPENAI_API_KEY is not set. Running with local fallback embeddings and extractive answers. Set OPENAI_API_KEY in .env for real semantic search + LLM answers."
    );
  }
});

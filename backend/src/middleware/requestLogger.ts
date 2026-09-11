import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on("finish", () => {
    logger.info("Request completed", {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
    });
  });
  next();
}

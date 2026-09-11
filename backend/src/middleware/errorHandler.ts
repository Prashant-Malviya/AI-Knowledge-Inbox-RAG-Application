import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";
import { logger } from "../utils/logger";

/** Wraps an async route handler so rejected promises reach the error middleware. */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      code: "NOT_FOUND",
    },
  });
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : "Internal server error";

  logger.error("Request failed", {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    message,
    stack: err instanceof Error ? err.stack : undefined,
  });

  res.status(statusCode).json({
    error: {
      message,
      code: isAppError ? err.name : "INTERNAL_ERROR",
      ...(isAppError && err.details ? { details: err.details } : {}),
    },
  });
}

import { randomUUID } from "crypto";
import { logger } from "../utils/logger.js";

export function requestIdMiddleware(req, res, next) {
  req.requestId = req.headers["x-request-id"] || randomUUID();
  res.setHeader("x-request-id", req.requestId);
  next();
}

export function requestLoggerMiddleware(req, res, next) {
  const start = Date.now();
  const log = logger.child({ requestId: req.requestId });

  res.on("finish", () => {
    log.info("HTTP request", {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - start,
    });
  });

  next();
}

import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { recordMonitoringEvent } from "../utils/monitoringMetrics.js";

export function notFoundHandler(_req, res) {
  res.status(404).json({ message: "Kaynak bulunamadi" });
}

export function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Sunucu hatasi";

  if (status >= 500) {
    recordMonitoringEvent("error", message, {
      path: req.path,
      method: req.method,
      status,
    });
    logger.error("Unhandled request error", {
      requestId: req.requestId,
      path: req.path,
      method: req.method,
      status,
      message: err.message,
      stack: env.isProd ? undefined : err.stack,
    });
  }

  res.status(status).json({
    message: status >= 500 && env.isProd ? "Sunucu hatasi" : message,
    ...(err.code ? { code: err.code } : {}),
    ...(env.isProd ? {} : { stack: err.stack }),
  });
}

export class AppError extends Error {
  constructor(message, status = 400, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

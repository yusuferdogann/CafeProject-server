import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

export const helmetMiddleware = helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
});

export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin || !env.isProd || env.CORS_ORIGINS.length === 0) {
      return callback(null, true);
    }
    if (env.CORS_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS politikasi tarafindan engellendi"));
  },
  credentials: true,
});

export const globalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Cok fazla istek. Lutfen daha sonra tekrar deneyin." },
});

export const authRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Cok fazla giris denemesi. Lutfen daha sonra tekrar deneyin." },
});

import dotenv from "dotenv";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "development";
const isProd = NODE_ENV === "production";

function requireEnv(name, { minLength = 0 } = {}) {
  const value = process.env[name]?.trim();
  if (!value || value.length < minLength) {
    throw new Error(
      `${name} ortam degiskeni gerekli${minLength ? ` (min ${minLength} karakter)` : ""}.`
    );
  }
  return value;
}

function parseOrigins(value) {
  if (!value?.trim()) return [];
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const JWT_SECRET = isProd
  ? requireEnv("JWT_SECRET", { minLength: 32 })
  : process.env.JWT_SECRET?.trim() || "cafe-dev-secret-local-only";

if (isProd && process.env.SKIP_DB === "true") {
  throw new Error("SKIP_DB=true production ortaminda kullanilamaz.");
}

const DB_PROVIDER = (process.env.DB_PROVIDER || "postgres").toLowerCase();
if (!["postgres", "mongodb"].includes(DB_PROVIDER)) {
  throw new Error("DB_PROVIDER sadece postgres veya mongodb olabilir.");
}

export const env = {
  NODE_ENV,
  isProd,
  PORT: Number(process.env.PORT) || 5000,
  DB_PROVIDER,
  DATABASE_URL: process.env.DATABASE_URL?.trim() || "",
  PG_SSL: process.env.PG_SSL === "true",
  MONGODB_URI: process.env.MONGODB_URI?.trim() || "",
  SKIP_DB: process.env.SKIP_DB === "true",
  JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN?.trim() || "7d",
  CORS_ORIGINS: parseOrigins(process.env.CORS_ORIGIN),
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX) || 300,
  AUTH_RATE_LIMIT_MAX: Number(process.env.AUTH_RATE_LIMIT_MAX) || 20,
  BODY_LIMIT: process.env.BODY_LIMIT?.trim() || "2mb",
};

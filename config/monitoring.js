import { env } from "./env.js";

export const monitoringConfig = {
  email: (process.env.OPS_EMAIL || "administor@gmmail.com").toLowerCase().trim(),
  password: process.env.OPS_PASSWORD || "1234",
  tokenExpiresIn: process.env.OPS_TOKEN_EXPIRES_IN || "12h",
  sentryConfigured: !!process.env.SENTRY_DSN?.trim(),
  uptimeUrl: process.env.UPTIME_MONITOR_URL?.trim() || null,
};

export function validateOpsCredentials(email, password) {
  const normalizedEmail = email?.toLowerCase?.().trim();
  if (!normalizedEmail || !password) return false;
  return normalizedEmail === monitoringConfig.email && password === monitoringConfig.password;
}

export function assertOpsConfigured() {
  if (env.isProd && monitoringConfig.password === "1234") {
    console.warn("OPS_PASSWORD production ortaminda varsayilan degerde. Degistirin.");
  }
}

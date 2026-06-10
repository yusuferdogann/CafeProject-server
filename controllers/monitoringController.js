import os from "os";
import { env } from "../config/env.js";
import { monitoringConfig, validateOpsCredentials } from "../config/monitoring.js";
import { getDatabaseLabel, isDbReady } from "../utils/dbState.js";
import { createOpsToken } from "../middleware/monitoringAuth.js";
import { AppError } from "../middleware/errorHandler.js";
import {
  getRecentEvents,
  getUptimeSeconds,
  recordMonitoringEvent,
} from "../utils/monitoringMetrics.js";

export async function opsLogin(req, res) {
  const { email, password } = req.body;

  if (!validateOpsCredentials(email, password)) {
    throw new AppError("Ops giris bilgileri hatali", 401, "OPS_AUTH_FAILED");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const token = createOpsToken(normalizedEmail);
  recordMonitoringEvent("info", "Ops panel girisi", { email: normalizedEmail });

  res.json({
    token,
    user: {
      email: normalizedEmail,
      role: "ops",
    },
  });
}

export async function getMonitoringOverview(_req, res) {
  const dbConnected = isDbReady();
  const memory = process.memoryUsage();

  const services = [
    {
      id: "api",
      label: "Cafe API",
      status: "up",
      detail: "Express sunucusu calisiyor",
    },
    {
      id: "database",
      label: env.DB_PROVIDER === "postgres" ? "PostgreSQL" : "MongoDB",
      status: dbConnected ? "up" : env.SKIP_DB ? "degraded" : "down",
      detail: dbConnected
        ? `${getDatabaseLabel()} baglantisi aktif`
        : env.SKIP_DB
          ? "SKIP_DB modu — kalici kayit kapali"
          : "Baglanti yok",
    },
  ];

  const overallStatus = services.every((service) => service.status === "up")
    ? "healthy"
    : services.some((service) => service.status === "down")
      ? "unhealthy"
      : "degraded";

  res.json({
    status: overallStatus,
    services,
    environment: env.NODE_ENV,
    uptimeSeconds: getUptimeSeconds(),
    system: {
      nodeVersion: process.version,
      platform: `${os.platform()} ${os.arch()}`,
      memoryMb: {
        rss: Math.round(memory.rss / 1024 / 1024),
        heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
      },
      loadAverage: os.loadavg(),
      timestamp: new Date().toISOString(),
    },
    integrations: {
      sentry: {
        configured: monitoringConfig.sentryConfigured,
        status: monitoringConfig.sentryConfigured ? "ready" : "not_configured",
        hint: monitoringConfig.sentryConfigured
          ? "SENTRY_DSN tanimli"
          : "SENTRY_DSN env ile baglanabilir",
      },
      uptime: {
        configured: !!monitoringConfig.uptimeUrl,
        status: monitoringConfig.uptimeUrl ? "ready" : "not_configured",
        url: monitoringConfig.uptimeUrl,
        hint: monitoringConfig.uptimeUrl
          ? "Harici uptime monitoru tanimli"
          : "UPTIME_MONITOR_URL env ile eklenebilir",
      },
    },
    recentEvents: getRecentEvents().slice(0, 20),
  });
}

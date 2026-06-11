import express from "express";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import employeeRoutes from "./routes/employees.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import monitoringRoutes from "./routes/monitoring.routes.js";
import { assertOpsConfigured } from "./config/monitoring.js";
import { seedDefaults } from "./utils/seed.js";
import { getDatabaseLabel, isDbReady } from "./utils/dbState.js";
import { logger } from "./utils/logger.js";
import {
  authRateLimiter,
  corsMiddleware,
  globalRateLimiter,
  helmetMiddleware,
} from "./middleware/security.js";
import { requestIdMiddleware, requestLoggerMiddleware } from "./middleware/requestLogger.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.set("trust proxy", 1);
app.use(requestIdMiddleware);
app.use(requestLoggerMiddleware);
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(globalRateLimiter);
app.use(express.json({ limit: env.BODY_LIMIT }));

app.get("/api/health", (_req, res) => {
  const dbConnected = isDbReady();
  res.json({
    status: "ok",
    message: "Cafe API is running",
    environment: env.NODE_ENV,
    provider: env.DB_PROVIDER,
    database: getDatabaseLabel(),
    dbConnected,
    skipDb: env.SKIP_DB,
  });
});

app.use("/api/auth", authRateLimiter, authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/monitoring", authRateLimiter, monitoringRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    const connected = await connectDatabase();
    if (!connected && !env.SKIP_DB) {
      throw new Error(
        env.DB_PROVIDER === "postgres"
          ? "PostgreSQL baglantisi kurulamadi. DATABASE_URL ve sunucuyu kontrol edin."
          : "MongoDB baglantisi kurulamadi. Atlas IP iznini kontrol edin."
      );
    }
    await seedDefaults();
    assertOpsConfigured();

    const server = app.listen(env.PORT, () => {
      logger.info("Server started", { port: env.PORT, environment: env.NODE_ENV });
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        logger.error("Port already in use", { port: env.PORT });
        process.exit(1);
      }
      logger.error("Failed to start server", { message: error.message });
      process.exit(1);
    });
  } catch (error) {
    logger.error("Failed to start server", { message: error.message });
    process.exit(1);
  }
};

startServer();

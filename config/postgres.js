import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";
import { setPostgresReady } from "../utils/dbState.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let pool = null;

export function getPool() {
  return pool;
}

async function runMigrations(client) {
  const schemaPath = path.join(__dirname, "..", "db", "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");
  await client.query(sql);
}

export async function connectPostgres() {
  if (!env.DATABASE_URL) {
    if (env.SKIP_DB) {
      logger.warn("SKIP_DB=true - PostgreSQL baglantisi atlandi.");
      setPostgresReady(false);
      return false;
    }
    throw new Error("DATABASE_URL tanimli degil.");
  }

  try {
    pool = new pg.Pool({
      connectionString: env.DATABASE_URL,
      ssl: env.PG_SSL ? { rejectUnauthorized: false } : undefined,
      max: 10,
      connectionTimeoutMillis: 12000,
    });

    const client = await pool.connect();
    try {
      await runMigrations(client);
    } finally {
      client.release();
    }

    setPostgresReady(true);
    logger.info("PostgreSQL connected", { provider: "postgres" });
    return true;
  } catch (error) {
    setPostgresReady(false);
    logger.error("PostgreSQL connection failed", { message: error.message });

    if (env.SKIP_DB) {
      logger.warn("SKIP_DB=true - Sunucu PostgreSQL olmadan baslatiliyor.");
      return false;
    }
    throw error;
  }
}

export async function closePostgres() {
  if (pool) {
    await pool.end();
    pool = null;
  }
  setPostgresReady(false);
}

export async function pgQuery(text, params = []) {
  if (!pool) {
    throw new Error("PostgreSQL pool hazir degil");
  }
  return pool.query(text, params);
}

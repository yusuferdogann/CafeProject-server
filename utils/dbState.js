import mongoose from "mongoose";
import { env } from "../config/env.js";

let postgresReady = false;

export function setPostgresReady(value) {
  postgresReady = value;
}

export function isPostgresProvider() {
  return env.DB_PROVIDER === "postgres";
}

export function isMongoProvider() {
  return env.DB_PROVIDER === "mongodb";
}

export function isDbReady() {
  if (isPostgresProvider()) return postgresReady;
  return mongoose.connection.readyState === 1;
}

export function getDatabaseLabel() {
  if (!isDbReady()) return "disconnected";
  return isPostgresProvider() ? "postgresql" : "mongodb";
}

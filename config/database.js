import { env } from "./env.js";
import connectMongo from "./db.js";
import { connectPostgres } from "./postgres.js";

export async function connectDatabase() {
  if (env.DB_PROVIDER === "postgres") {
    return connectPostgres();
  }
  return connectMongo();
}

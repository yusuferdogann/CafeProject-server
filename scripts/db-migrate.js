import dotenv from "dotenv";
import { connectPostgres, closePostgres } from "../config/postgres.js";

dotenv.config();

async function main() {
  const connected = await connectPostgres();
  if (!connected) {
    console.error("PostgreSQL baglantisi kurulamadi. DATABASE_URL kontrol edin.");
    process.exit(1);
  }
  console.log("PostgreSQL migration tamamlandi.");
  await closePostgres();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

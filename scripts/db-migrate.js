import dotenv from "dotenv";
import { connectPostgres, closePostgres } from "../config/postgres.js";

dotenv.config();

async function main() {
  if ((process.env.DB_PROVIDER || "postgres").toLowerCase() !== "postgres") {
    console.error('DB_PROVIDER=postgres olmali. MongoDB desteklenmiyor (migrate).');
    process.exit(1);
  }

  const connected = await connectPostgres();
  if (!connected) {
    console.error("PostgreSQL baglantisi kurulamadi.");
    console.error("Kontrol: DATABASE_URL, kullanici/sifre, db/grants.sql");
    process.exit(1);
  }
  console.log("PostgreSQL migration tamamlandi (tablolar hazir).");
  await closePostgres();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

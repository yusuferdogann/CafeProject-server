import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env");
const examplePath = path.join(root, ".env.example");

if (fs.existsSync(envPath)) {
  console.log(".env zaten var — dokunulmadi.");
  process.exit(0);
}

if (!fs.existsSync(examplePath)) {
  console.error(".env.example bulunamadi.");
  process.exit(1);
}

fs.copyFileSync(examplePath, envPath);
console.log(".env olusturuldu (.env.example kopyalandi).");
console.log("Simdi duzenleyin: nano .env");
console.log("  - DATABASE_URL (PostgreSQL sifre)");
console.log("  - JWT_SECRET (32+ karakter)");
console.log("  - OPS_PASSWORD");

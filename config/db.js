import mongoose from "mongoose";
import { fetchPublicIp, isAtlasNetworkError } from "./atlasHelp.js";

async function printAtlasHelp() {
  const ip = await fetchPublicIp();
  console.error("\n--- MongoDB Atlas Network Access ---");
  console.error("1. https://cloud.mongodb.com acin");
  console.error("2. Network Access > Add IP Address");
  if (ip) {
    console.error(`3. Su IP'yi ekleyin: ${ip}/32  (Add Current IP Address)`);
  } else {
    console.error("3. 'Add Current IP Address' secin");
  }
  console.error("4. Gelistirme icin gecici: 0.0.0.0/0 (Allow from anywhere)");
  console.error("5. Kaydedin, 1-2 dk bekleyin, backend'i yeniden baslatin");
  console.error("6. IP ekledikten sonra .env icinde SKIP_DB=false yapin");
  console.error("https://www.mongodb.com/docs/atlas/security-whitelist/\n");
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    if (process.env.SKIP_DB === "true") {
      console.warn("SKIP_DB=true - MongoDB baglantisi atlandi.");
      return false;
    }
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 12000 });
    console.log("MongoDB Connected");
    return true;
  } catch (error) {
    if (isAtlasNetworkError(error)) {
      await printAtlasHelp();
    }
    if (process.env.SKIP_DB === "true") {
      console.warn("SKIP_DB=true - Sunucu MongoDB olmadan baslatiliyor.\n");
      return false;
    }
    throw error;
  }
};

export default connectDB;

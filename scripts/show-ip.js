import { fetchPublicIp } from "../config/atlasHelp.js";

const ip = await fetchPublicIp();

console.log("\nMongoDB Atlas icin eklenecek IP:");
if (ip) {
  console.log(`  ${ip}/32`);
} else {
  console.log("  IP alinamadi - Atlas'ta 'Add Current IP Address' kullanin");
}
console.log("\nAtlas > Network Access > Add IP Address\n");

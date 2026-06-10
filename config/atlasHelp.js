import https from "https";

export function fetchPublicIp() {
  return new Promise((resolve) => {
    const req = https.get("https://api.ipify.org?format=json", { timeout: 8000 }, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          resolve(JSON.parse(data).ip || null);
        } catch {
          resolve(null);
        }
      });
    });

    req.on("error", () => resolve(null));
    req.on("timeout", () => {
      req.destroy();
      resolve(null);
    });
  });
}

export function isAtlasNetworkError(error) {
  const message = `${error?.message || ""} ${error?.reason?.message || ""}`.toLowerCase();
  return (
    message.includes("whitelist") ||
    message.includes("ip that isn't whitelisted") ||
    message.includes("could not connect to any servers")
  );
}

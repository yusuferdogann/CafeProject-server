import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { monitoringConfig } from "../config/monitoring.js";

const OPS_ROLE = "ops";

export function createOpsToken(email) {
  return jwt.sign({ role: OPS_ROLE, email }, env.JWT_SECRET, {
    expiresIn: monitoringConfig.tokenExpiresIn,
  });
}

export function verifyOpsToken(token) {
  const payload = jwt.verify(token, env.JWT_SECRET);
  if (payload.role !== OPS_ROLE) {
    throw new Error("Invalid ops token");
  }
  return payload;
}

export function requireOpsAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Ops oturumu gerekli", code: "OPS_AUTH_REQUIRED" });
  }

  try {
    req.opsUser = verifyOpsToken(token);
    next();
  } catch {
    return res.status(401).json({ message: "Gecersiz ops oturumu", code: "OPS_AUTH_INVALID" });
  }
}

import { verifyToken } from "../utils/auth.js";
import { isDbReady } from "../utils/dbState.js";
import { findUserById } from "../repositories/userRepository.js";

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Oturum gerekli", code: "AUTH_REQUIRED" });
  }

  try {
    const payload = verifyToken(token);

    if (isDbReady()) {
      const user = await findUserById(payload.id);
      if (!user || !user.active) {
        return res.status(401).json({ message: "Gecersiz veya suresi dolmus oturum", code: "AUTH_INVALID" });
      }

      req.user = {
        id: user.id,
        businessId: user.businessId,
        role: user.role,
        email: user.email,
        name: user.name,
      };
    } else {
      req.user = payload;
    }

    next();
  } catch {
    return res.status(401).json({ message: "Gecersiz veya suresi dolmus oturum", code: "AUTH_INVALID" });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Bu islem icin admin yetkisi gerekli", code: "FORBIDDEN" });
  }
  next();
}

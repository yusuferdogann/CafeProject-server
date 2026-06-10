import { comparePassword, createToken } from "../utils/auth.js";
import { env } from "../config/env.js";
import { findDevUser, DEV_BUSINESS } from "../utils/seed.js";
import { isDbReady } from "../utils/dbState.js";
import { AppError } from "../middleware/errorHandler.js";
import { findBusinessById } from "../repositories/businessRepository.js";
import { findActiveUserByEmail, findUserById } from "../repositories/userRepository.js";

export async function login(req, res) {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  if (!isDbReady()) {
    if (env.isProd) {
      throw new AppError("Veritabani baglantisi gerekli", 503, "DB_UNAVAILABLE");
    }

    const devUser = findDevUser(normalizedEmail, password);
    if (!devUser) {
      throw new AppError("Email veya sifre hatali", 401, "AUTH_FAILED");
    }

    const token = createToken({
      id: devUser.id,
      businessId: devUser.businessId,
      role: devUser.role,
      email: devUser.email,
      name: devUser.name,
    });

    return res.json({
      token,
      user: {
        id: devUser.id,
        name: devUser.name,
        email: devUser.email,
        role: devUser.role,
        businessId: devUser.businessId,
        businessName: DEV_BUSINESS.name,
        businessSlug: DEV_BUSINESS.slug,
      },
    });
  }

  const user = await findActiveUserByEmail(normalizedEmail);
  if (!user) {
    throw new AppError("Email veya sifre hatali", 401, "AUTH_FAILED");
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    throw new AppError("Email veya sifre hatali", 401, "AUTH_FAILED");
  }

  const business = await findBusinessById(user.businessId);

  const token = createToken({
    id: user.id,
    businessId: user.businessId,
    role: user.role,
    email: user.email,
    name: user.name,
  });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      businessId: user.businessId,
      businessName: business?.name,
      businessSlug: business?.slug,
    },
  });
}

export async function me(req, res) {
  if (!isDbReady()) {
    return res.json({ user: req.user });
  }

  const user = await findUserById(req.user.id);
  if (!user) {
    throw new AppError("Kullanici bulunamadi", 404, "USER_NOT_FOUND");
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      businessId: user.businessId,
    },
  });
}

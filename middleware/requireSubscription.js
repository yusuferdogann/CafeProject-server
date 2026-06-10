import { AppError } from "./errorHandler.js";
import {
  buildSubscriptionStatus,
  getDevSubscription,
  serializeSubscription,
} from "../utils/subscriptionStore.js";
import { isDbReady } from "../utils/dbState.js";
import { findBusinessById } from "../repositories/businessRepository.js";

async function loadSubscription(businessId) {
  if (!isDbReady()) {
    return getDevSubscription(businessId);
  }

  const business = await findBusinessById(businessId);
  if (!business) return null;
  return serializeSubscription(business.subscription);
}

export function requireSubscription() {
  return async (req, _res, next) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) {
        throw new AppError("Isletme bilgisi bulunamadi", 403, "TENANT_MISSING");
      }

      const raw = await loadSubscription(businessId);
      if (!raw) {
        throw new AppError("Isletme bulunamadi", 404, "BUSINESS_NOT_FOUND");
      }

      const status = buildSubscriptionStatus(raw);
      if (!status.isActive) {
        throw new AppError(
          status.blockReason || "Aktif abonelik gerekli",
          402,
          "SUBSCRIPTION_INACTIVE"
        );
      }

      req.subscription = status;
      next();
    } catch (error) {
      next(error);
    }
  };
}

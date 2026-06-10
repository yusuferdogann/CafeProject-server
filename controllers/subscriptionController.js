import { SUBSCRIPTION_PLANS } from "../config/plans.js";
import { env } from "../config/env.js";
import { isDbReady } from "../utils/dbState.js";
import { AppError } from "../middleware/errorHandler.js";
import {
  activateDevPlan,
  buildSubscriptionStatus,
  getDevSubscription,
  serializeSubscription,
  setDevSubscription,
} from "../utils/subscriptionStore.js";
import {
  findBusinessById,
  updateBusinessSubscription,
} from "../repositories/businessRepository.js";

function resolveBusinessId(req) {
  return req.user?.businessId?.toString?.() || req.user?.businessId;
}

async function readSubscription(businessId) {
  if (!isDbReady()) {
    return getDevSubscription(businessId);
  }

  const business = await findBusinessById(businessId);
  if (!business) return null;

  return serializeSubscription(business.subscription) || getDevSubscription(businessId);
}

async function writeSubscription(businessId, subscription) {
  if (!isDbReady()) {
    setDevSubscription(businessId, subscription);
    return subscription;
  }

  const business = await updateBusinessSubscription(businessId, subscription);
  return serializeSubscription(business?.subscription) || subscription;
}

export async function getSubscriptionStatus(req, res) {
  const businessId = resolveBusinessId(req);
  const raw = await readSubscription(businessId);

  if (!raw) {
    return res.status(404).json({ message: "Isletme bulunamadi" });
  }

  res.json(buildSubscriptionStatus(raw));
}

export async function purchaseSubscription(req, res) {
  const businessId = resolveBusinessId(req);
  const { planId, platform = "web", receiptId } = req.body || {};

  if (!SUBSCRIPTION_PLANS[planId]) {
    throw new AppError("Gecersiz plan", 400, "INVALID_PLAN");
  }

  const allowMockPayments = process.env.ALLOW_MOCK_PAYMENTS === "true";
  if (env.isProd && !receiptId && !allowMockPayments) {
    throw new AppError(
      "Odeme makbuzu gerekli. App Store / Play Billing entegrasyonu tamamlanmali.",
      402,
      "RECEIPT_REQUIRED"
    );
  }

  if (!isDbReady()) {
    if (env.isProd) {
      throw new AppError("Veritabani baglantisi gerekli", 503, "DB_UNAVAILABLE");
    }

    const subscription = activateDevPlan(businessId, planId, platform);
    return res.json({
      message: "Abonelik aktif edildi",
      subscription: buildSubscriptionStatus(subscription),
      receiptId: receiptId || `dev-${Date.now()}`,
    });
  }

  const subscription = activateDevPlan(businessId, planId, platform);
  await writeSubscription(businessId, subscription);

  res.json({
    message: "Abonelik aktif edildi",
    subscription: buildSubscriptionStatus(subscription),
    receiptId: receiptId || `mock-${Date.now()}`,
  });
}

export async function cancelSubscription(req, res) {
  const businessId = resolveBusinessId(req);
  const raw = await readSubscription(businessId);

  if (!raw) {
    return res.status(404).json({ message: "Isletme bulunamadi" });
  }

  const next = {
    ...raw,
    cancelAtPeriodEnd: true,
  };

  await writeSubscription(businessId, next);

  res.json({
    message: "Abonelik donem sonunda iptal edilecek",
    subscription: buildSubscriptionStatus(next),
  });
}

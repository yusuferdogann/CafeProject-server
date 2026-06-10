const ALLOWED_PLANS = new Set(["monthly", "yearly"]);
const ALLOWED_PLATFORMS = new Set(["web", "ios", "android"]);

export function purchaseBody(body) {
  const planId = body.planId?.trim();
  const platform = body.platform?.trim() || "web";
  const receiptId = body.receiptId?.trim();

  if (!planId || !ALLOWED_PLANS.has(planId)) {
    return { error: "Gecerli bir plan secin" };
  }

  if (!ALLOWED_PLATFORMS.has(platform)) {
    return { error: "Gecersiz platform" };
  }

  return {
    value: {
      planId,
      platform,
      ...(receiptId ? { receiptId } : {}),
    },
  };
}

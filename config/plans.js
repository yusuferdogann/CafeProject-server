export const SUBSCRIPTION_PLANS = {
  monthly: {
    id: "monthly",
    label: "Aylik",
    priceTry: 499,
    intervalMonths: 1,
    storeProductIds: {
      ios: "cafe_project_monthly",
      android: "cafe_project_monthly",
    },
  },
  yearly: {
    id: "yearly",
    label: "Yillik",
    priceTry: 4990,
    intervalMonths: 12,
    badge: "2 ay bedava",
    storeProductIds: {
      ios: "cafe_project_yearly",
      android: "cafe_project_yearly",
    },
  },
};

export const TRIAL_DAYS = 14;

export const WARNING_DAYS_BEFORE_EXPIRY = 7;

import { SUBSCRIPTION_PLANS, TRIAL_DAYS, WARNING_DAYS_BEFORE_EXPIRY } from "../config/plans.js";
import { DEV_BUSINESS } from "./seed.js";

const subscriptions = new Map();

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMonths(date, months) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function defaultTrialSubscription() {
  const now = new Date();
  return {
    plan: "trial",
    status: "active",
    platform: "trial",
    currentPeriodStart: now.toISOString(),
    currentPeriodEnd: addDays(now, TRIAL_DAYS).toISOString(),
    trialEndsAt: addDays(now, TRIAL_DAYS).toISOString(),
    lastPaymentAt: null,
    cancelAtPeriodEnd: false,
  };
}

export function getDevSubscription(businessId = DEV_BUSINESS.id) {
  if (!subscriptions.has(businessId)) {
    subscriptions.set(businessId, defaultTrialSubscription());
  }
  return subscriptions.get(businessId);
}

export function setDevSubscription(businessId, patch) {
  const current = getDevSubscription(businessId);
  const next = { ...current, ...patch };
  subscriptions.set(businessId, next);
  return next;
}

export function activateDevPlan(businessId, planId, platform = "web") {
  const plan = SUBSCRIPTION_PLANS[planId];
  if (!plan) return null;

  const now = new Date();
  const subscription = {
    plan: planId,
    status: "active",
    platform,
    currentPeriodStart: now.toISOString(),
    currentPeriodEnd: addMonths(now, plan.intervalMonths).toISOString(),
    trialEndsAt: null,
    lastPaymentAt: now.toISOString(),
    cancelAtPeriodEnd: false,
  };

  subscriptions.set(businessId, subscription);
  return subscription;
}

function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function daysUntil(dateValue) {
  const date = toDate(dateValue);
  if (!date) return 0;
  const diff = date.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function normalizeSubscriptionForDb(subscription) {
  return {
    ...subscription,
    currentPeriodStart: toDate(subscription.currentPeriodStart),
    currentPeriodEnd: toDate(subscription.currentPeriodEnd),
    trialEndsAt: toDate(subscription.trialEndsAt),
    lastPaymentAt: toDate(subscription.lastPaymentAt),
  };
}

export function serializeSubscription(raw) {
  if (!raw) return null;
  return {
    plan: raw.plan,
    status: raw.status,
    platform: raw.platform,
    currentPeriodStart: toDate(raw.currentPeriodStart)?.toISOString?.() || null,
    currentPeriodEnd: toDate(raw.currentPeriodEnd)?.toISOString?.() || null,
    trialEndsAt: toDate(raw.trialEndsAt)?.toISOString?.() || null,
    lastPaymentAt: toDate(raw.lastPaymentAt)?.toISOString?.() || null,
    cancelAtPeriodEnd: !!raw.cancelAtPeriodEnd,
    externalId: raw.externalId || null,
  };
}

export function buildSubscriptionStatus(raw) {
  const now = Date.now();
  const periodEnd = toDate(raw?.currentPeriodEnd)?.getTime?.() || 0;
  const isExpired = periodEnd > 0 && periodEnd < now;
  const daysLeft = daysUntil(raw?.currentPeriodEnd);
  const isActive = raw?.status === "active" && !isExpired;
  const isTrial = raw?.plan === "trial" && isActive;
  const warning =
    isActive && daysLeft > 0 && daysLeft <= WARNING_DAYS_BEFORE_EXPIRY
      ? `Aboneliginiz ${daysLeft} gun icinde sona erecek.`
      : null;

  let blockReason = null;
  if (!isActive) {
    if (isExpired) {
      blockReason = "Abonelik suresi doldu. Devam etmek icin odeme yapin.";
    } else if (raw?.status === "past_due") {
      blockReason = "Odeme alinamadi. Lutfen aboneliginizi yenileyin.";
    } else {
      blockReason = "Aktif abonelik bulunamadi.";
    }
  }

  return {
    ...raw,
    isActive,
    isTrial,
    daysLeft: Math.max(daysLeft, 0),
    warning,
    blockReason,
    plans: Object.values(SUBSCRIPTION_PLANS),
  };
}

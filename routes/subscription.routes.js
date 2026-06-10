import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import {
  cancelSubscription,
  getSubscriptionStatus,
  purchaseSubscription,
} from "../controllers/subscriptionController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validateBody } from "../middleware/validate.js";
import { purchaseBody } from "../validators/subscription.validator.js";

const router = Router();

router.get("/status", asyncHandler(requireAuth), requireAdmin, asyncHandler(getSubscriptionStatus));
router.post(
  "/purchase",
  asyncHandler(requireAuth),
  requireAdmin,
  validateBody(purchaseBody),
  asyncHandler(purchaseSubscription)
);
router.post("/cancel", asyncHandler(requireAuth), requireAdmin, asyncHandler(cancelSubscription));

export default router;

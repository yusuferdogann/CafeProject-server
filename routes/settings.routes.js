import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { requireSubscription } from "../middleware/requireSubscription.js";
import {
  getAdminSettings,
  getPublicSettings,
  updateAdminSettings,
} from "../controllers/settingsController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/public/:slug", asyncHandler(getPublicSettings));
router.get("/", asyncHandler(requireAuth), requireAdmin, asyncHandler(getAdminSettings));
router.put(
  "/",
  asyncHandler(requireAuth),
  requireAdmin,
  asyncHandler(requireSubscription()),
  asyncHandler(updateAdminSettings)
);

export default router;

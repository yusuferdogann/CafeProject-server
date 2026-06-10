import { Router } from "express";
import { opsLogin, getMonitoringOverview } from "../controllers/monitoringController.js";
import { requireOpsAuth } from "../middleware/monitoringAuth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validateBody } from "../middleware/validate.js";
import { loginBody } from "../validators/auth.validator.js";

const router = Router();

router.post("/login", validateBody(loginBody), asyncHandler(opsLogin));
router.get("/overview", requireOpsAuth, asyncHandler(getMonitoringOverview));

export default router;

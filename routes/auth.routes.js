import { Router } from "express";
import { login, me } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validateBody } from "../middleware/validate.js";
import { loginBody } from "../validators/auth.validator.js";

const router = Router();

router.post("/login", validateBody(loginBody), asyncHandler(login));
router.get("/me", asyncHandler(requireAuth), asyncHandler(me));

export default router;

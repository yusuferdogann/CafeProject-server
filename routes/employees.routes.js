import { Router } from "express";
import {
  createEmployee,
  listEmployees,
  updateEmployeeHandler,
  deleteEmployeeHandler,
} from "../controllers/employeeController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { requireSubscription } from "../middleware/requireSubscription.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import { employeeBody, employeeIdParams } from "../validators/employee.validator.js";

const router = Router();

router.use(asyncHandler(requireAuth), requireAdmin, asyncHandler(requireSubscription()));

router.get("/", asyncHandler(listEmployees));
router.post("/", validateBody((body) => employeeBody(body, { requirePassword: true })), asyncHandler(createEmployee));
router.put(
  "/:id",
  validateParams(employeeIdParams),
  validateBody((body) => employeeBody(body)),
  asyncHandler(updateEmployeeHandler)
);
router.delete("/:id", validateParams(employeeIdParams), asyncHandler(deleteEmployeeHandler));

export default router;

import { Router } from "express";
import Joi from "joi";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";
import { validateBody, validateParams } from "../middlewares/validationMiddleware.js";
import {
  getMe,
  adminCreateUser,
  adminCreateUserSchema,
  adminUpdateRole,
  adminUpdateRoleSchema
} from "../controllers/userController.js";

const router = Router();

const objectIdParamSchema = Joi.object({
  id: Joi.string().pattern(/^[a-fA-F0-9]{24}$/).required()
}).required();

router.use(authMiddleware);

// viewer+ can read their own profile
router.get("/me", requireRole([ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN]), getMe);

// admin can create users
router.post("/", requireRole([ROLES.ADMIN]), validateBody(adminCreateUserSchema), adminCreateUser);

// admin can update any user's role
router.patch(
  "/:id/role",
  requireRole([ROLES.ADMIN]),
  validateParams(objectIdParamSchema),
  validateBody(adminUpdateRoleSchema),
  adminUpdateRole
);

export default router;


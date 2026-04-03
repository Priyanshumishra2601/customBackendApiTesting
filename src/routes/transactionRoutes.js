import { Router } from "express";
import Joi from "joi";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";
import {
  createTransaction,
  listTransactions,
  updateTransaction,
  deleteTransaction,
  transactionCreateSchema,
  transactionUpdateSchema,
  transactionQuerySchema
} from "../controllers/transactionController.js";
import { validateBody, validateParams, validateQuery } from "../middlewares/validationMiddleware.js";

const router = Router();

const objectIdParamSchema = Joi.object({
  id: Joi.string().pattern(/^[a-fA-F0-9]{24}$/).required()
}).required();

router.use(authMiddleware);

// Only admin is allowed to add, update or remove transactions
router.get(
  "/",
  requireRole([ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN]),
  validateQuery(transactionQuerySchema),
  listTransactions
);

// Logged-in users can view the transactions that belong to them
router.post(
  "/",
  requireRole([ROLES.ADMIN]),
  validateBody(transactionCreateSchema),
  createTransaction
);

router.patch(
  "/:id",
  requireRole([ROLES.ADMIN]),
  validateParams(objectIdParamSchema),
  validateBody(transactionUpdateSchema),
  updateTransaction
);

router.delete(
  "/:id",
  requireRole([ROLES.ADMIN]),
  validateParams(objectIdParamSchema),
  deleteTransaction
);

export default router;


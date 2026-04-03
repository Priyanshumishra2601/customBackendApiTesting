import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";
import { validateQuery } from "../middlewares/validationMiddleware.js";
import {
  getDashboardTotals,
  getCategorySpending,
  getRecentTransactions,
  getMonthlyTrends,
  recentQuerySchema,
  monthlyTrendsQuerySchema
} from "../controllers/dashboardController.js";

const router = Router();

router.use(authMiddleware);

// Only analyst and admin can access dashboard insights

const analystOrAdmin = [ROLES.ANALYST, ROLES.ADMIN];

router.get("/totals", requireRole(analystOrAdmin), getDashboardTotals);
router.get("/category-spending", requireRole(analystOrAdmin), getCategorySpending);
router.get(
  "/recent-transactions",
  requireRole(analystOrAdmin),
  validateQuery(recentQuerySchema),
  getRecentTransactions
);
router.get(
  "/monthly-trends",
  requireRole(analystOrAdmin),
  validateQuery(monthlyTrendsQuerySchema),
  getMonthlyTrends
);

export default router;


import Joi from "joi";
import { Transaction } from "../models/Transaction.js";

export const recentQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(50).optional()
}).optional();

export const monthlyTrendsQuerySchema = Joi.object({
  months: Joi.number().integer().min(1).max(24).optional()
}).optional();


// Create a list of months with start and end dates
// Used to track data month by month
const buildMonthBuckets = (months) => {
  const now = new Date();
  const buckets = [];

  
  const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  for (let i = 0; i < months; i += 1) {
    const monthStart = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const endExclusive = new Date(start.getFullYear(), start.getMonth() + i + 1, 1);
    const key = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, "0")}`;

    buckets.push({
      key,
      year: monthStart.getFullYear(),
      month: monthStart.getMonth() + 1, // 1..12 for API consumers
      start: monthStart,
      endExclusive
    });
  }

  return buckets;
};

// Get total income, total expense and remaining balance of user
export const getDashboardTotals = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const aggregated = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" }
        }
      }
    ]).exec();

    const totals = { income: 0, expense: 0, net: 0 };
    aggregated.forEach((row) => {
      if (row._id === "income") totals.income = row.totalAmount;
      if (row._id === "expense") totals.expense = row.totalAmount;
    });
    totals.net = totals.income - totals.expense;

    return res.json({ success: true, data: totals });
  } catch (error) {
    return next(error);
  }
};

export const getCategorySpending = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const rows = await Transaction.aggregate([
      { $match: { user: userId, type: "expense" } },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]).exec();

    const data = rows.map((row) => ({
      category: row._id,
      totalAmount: row.totalAmount
    }));

    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

// Get latest transactions of the user (default limit = 10)
export const getRecentTransactions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const rows = await Transaction.find({ user: userId })
      .sort({ date: -1, _id: -1 })
      .limit(limit)
      .lean()
      .exec();

    return res.json({ success: true, data: rows });
  } catch (error) {
    return next(error);
  }
};

// Get latest transactions of the user (default limit = 10)
export const getMonthlyTrends = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const months = req.query.months ? Number(req.query.months) : 6;

    const buckets = buildMonthBuckets(months);
    const startBound = buckets[0].start;
    const endExclusive = buckets[buckets.length - 1].endExclusive;

    const rows = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startBound, $lt: endExclusive }
        }
      },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
            }
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
            }
          }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]).exec();

    const rowMap = new Map();
    rows.forEach((row) => {
      const year = row._id.year;
      const month = row._id.month;
      const key = `${year}-${String(month).padStart(2, "0")}`;
      rowMap.set(key, row);
    });

    const monthlyTrends = buckets.map((b) => {
      const row = rowMap.get(b.key);
      const income = row ? row.income : 0;
      const expense = row ? row.expense : 0;
      return {
        year: b.year,
        month: b.month,
        income,
        expense,
        net: income - expense
      };
    });

    return res.json({ success: true, data: monthlyTrends });
  } catch (error) {
    return next(error);
  }
};


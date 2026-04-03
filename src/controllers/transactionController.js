import Joi from "joi";
import { Transaction } from "../models/Transaction.js";
import { ApiError } from "../utils/ApiError.js";

export const transactionCreateSchema = Joi.object({
  amount: Joi.number().min(0).required(),
  type: Joi.string().valid("income", "expense").required(),
  category: Joi.string().trim().min(1).max(100).required(),
  date: Joi.date().required(),
  notes: Joi.string().trim().max(500).allow("").optional()
}).required();

export const transactionUpdateSchema = Joi.object({
  amount: Joi.number().min(0).optional(),
  type: Joi.string().valid("income", "expense").optional(),
  category: Joi.string().trim().min(1).max(100).optional(),
  date: Joi.date().optional(),
  notes: Joi.string().trim().max(500).allow("").optional()
})
  .min(1)
  .required();

export const transactionQuerySchema = Joi.object({
  category: Joi.string().trim().min(1).max(100).optional(),
  type: Joi.string().valid("income", "expense").optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  limit: Joi.number().integer().min(1).max(200).optional()
}).optional();

// Add a new transaction for the logged-in user
export const createTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.create({
      user: req.user._id,
      amount: req.body.amount,
      type: req.body.type,
      category: req.body.category,
      date: req.body.date,
      notes: req.body.notes
    });

    return res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    return next(error);
  }
};

// Get all transactions of user with optional filters (category, type, date)
export const listTransactions = async (req, res, next) => {
  try {
    const { category, type, startDate, endDate, limit } = req.query;

    const filter = { user: req.user._id };
    if (category) filter.category = category;
    if (type) filter.type = type;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (filter.date?.$gte && filter.date?.$lte) {
      if (filter.date.$gte > filter.date.$lte) {
        throw new ApiError(400, "Invalid date range", "DATE_RANGE_INVALID");
      }
    }

    const safeLimit = limit ? Number(limit) : 200;
    const transactions = await Transaction.find(filter)
      .sort({ date: -1, _id: -1 })
      .limit(safeLimit)
      .lean()
      .exec();

    return res.json({ success: true, data: transactions });
  } catch (error) {
    return next(error);
  }
};

//date a specific transaction if it belongs to the user
export const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await Transaction.findOne({ _id: id, user: req.user._id }).exec();

    if (!existing) {
      throw new ApiError(404, "Transaction not found", "TX_NOT_FOUND");
    }

    //date a specific transaction if it belongs to the user
    const patch = req.body;
    if (patch.amount !== undefined) existing.amount = patch.amount;
    if (patch.type !== undefined) existing.type = patch.type;
    if (patch.category !== undefined) existing.category = patch.category;
    if (patch.date !== undefined) existing.date = patch.date;
    if (patch.notes !== undefined) existing.notes = patch.notes;

    await existing.save();
    return res.json({ success: true, data: existing });
  } catch (error) {
    return next(error);
  }
};


export const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Transaction.findOneAndDelete({
      _id: id,
      user: req.user._id
    }).exec();

    if (!deleted) {
      throw new ApiError(404, "Transaction not found", "TX_NOT_FOUND");
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};


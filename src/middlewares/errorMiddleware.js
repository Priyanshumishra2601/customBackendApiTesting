import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";


export const errorMiddleware = (err, req, res, next) => {
  const isKnown = err instanceof ApiError;

  if (isKnown) {
    const payload = {
      message: err.message,
      code: err.code
    };
    if (err.details !== undefined) payload.details = err.details;
    if (process.env.NODE_ENV !== "production") payload.stack = err.stack;

    return res.status(err.statusCode).json({
      success: false,
      error: payload
    });
  }

  // Mongoose errors
  if (err?.name === "CastError" || err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      error: { message: "Invalid identifier", code: "INVALID_ID" }
    });
  }

  if (err?.name === "ValidationError") {
    const details =
      err.errors &&
      typeof err.errors === "object" &&
      Object.keys(err.errors).map((k) => ({
        field: k,
        message: err.errors[k]?.message
      }));

    return res.status(400).json({
      success: false,
      error: {
        message: "Database validation failed",
        code: "MONGOOSE_VALIDATION_ERROR",
        ...(details ? { details } : {})
      }
    });
  }

  // Duplicate key error (Mongo unique index)
  if (err && typeof err === "object" && err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: {
        message: "Duplicate key",
        code: "DUPLICATE_KEY",
        details: err.keyValue
      }
    });
  }

  // Fallback
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  return res.status(500).json({
    success: false,
    error: {
      message: "Unexpected error occurred",
      code: "INTERNAL_ERROR",
      ...(process.env.NODE_ENV !== "production" ? { stack: err?.stack } : {})
    }
  });
};


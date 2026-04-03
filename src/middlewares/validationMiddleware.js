import Joi from "joi";
import { ApiError } from "../utils/ApiError.js";

export const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const details = error.details.map((d) => d.message);
    return next(new ApiError(400, "Validation failed", "VALIDATION_ERROR", details));
  }

  req.body = value;
  return next();
};

export const validateParams = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.params, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const details = error.details.map((d) => d.message);
    return next(new ApiError(400, "Invalid URL parameters", "PARAM_VALIDATION_ERROR", details));
  }

  req.params = value || {};
  return next();
};

export const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const details = error.details.map((d) => d.message);
    return next(new ApiError(400, "Invalid query parameters", "QUERY_VALIDATION_ERROR", details));
  }

  req.query = value || {};
  return next();
};


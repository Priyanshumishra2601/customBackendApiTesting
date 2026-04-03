import { ApiError } from "../utils/ApiError.js";
import { roleWeight } from "../utils/roles.js";


export const requireRole = (allowedRoles) => {
  const safeAllowed = Array.isArray(allowedRoles) ? allowedRoles : [];
  if (safeAllowed.length === 0) {
    throw new Error("requireRole requires at least one allowed role");
  }

  const minWeight = Math.min(...safeAllowed.map((r) => roleWeight(r)));

  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required", "AUTH_REQUIRED"));
    }

    const currentWeight = roleWeight(req.user.role);
    if (currentWeight < minWeight) {
      return next(
        new ApiError(403, "You do not have permission for this action", "RBAC_FORBIDDEN")
      );
    }

    return next();
  };
};


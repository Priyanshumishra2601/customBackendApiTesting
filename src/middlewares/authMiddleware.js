import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

// Check if user is logged in using JWT token
// If token is valid, user data will be available in req.user
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const parts = authHeader.split(" ");
    const token = parts.length === 2 ? parts[1] : undefined;

    if (!token) {
      throw new ApiError(401, "Authentication token is missing", "AUTH_MISSING");
    }

    if (!process.env.JWT_SECRET) {
      throw new ApiError(500, "JWT_SECRET is not configured", "JWT_NOT_CONFIGURED");
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw new ApiError(401, "Invalid or expired token", "AUTH_INVALID");
    }

    // We store user id in JWT as `sub`
    const userId = payload.sub;
    const user = await User.findById(userId).exec();
    if (!user) {
      throw new ApiError(401, "User not found", "AUTH_USER_NOT_FOUND");
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};


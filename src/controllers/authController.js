import jwt from "jsonwebtoken";
import Joi from "joi";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ROLES } from "../utils/roles.js";

const registrationSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(8).max(128).required()
}).required();

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required()
}).required();

/**
 * Generates a JWT containing subject id and role.
 * @param {import("../models/User.js").Document & {_id: unknown, role: string}} user
 * @returns {string}
 */
const generateToken = (user) => {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );
};

// This function registers a new user
// By default, every user gets "viewer" role
// This prevents users from making themselves admin

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const normalizedEmail = email.toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail }).exec();
    if (existing) {
      throw new ApiError(409, "Email is already in use", "EMAIL_TAKEN");
    }

    const user = new User({
      name,
      email: normalizedEmail,
      role: ROLES.VIEWER
    });
    await user.setPassword(password);
    await user.save();

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    return next(error);
  }
};

// Create a new user account
// Role is always set to viewer for security

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail })
      .select("+passwordHash")
      .exec();

    if (!user) {
      throw new ApiError(401, "Invalid email or password", "AUTH_FAILED");
    }

    const matches = await user.comparePassword(password);
    if (!matches) {
      throw new ApiError(401, "Invalid email or password", "AUTH_FAILED");
    }

    const token = generateToken(user);
    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const authRegisterSchema = registrationSchema;
export const authLoginSchema = loginSchema;


import Joi from "joi";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ROLES } from "../utils/roles.js";

export const adminCreateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(8).max(128).required(),
  role: Joi.string().valid(...Object.values(ROLES)).required()
}).required();

export const adminUpdateRoleSchema = Joi.object({
  role: Joi.string().valid(...Object.values(ROLES)).required()
}).required();


export const getMe = async (req, res, next) => {
  try {
    return res.json({
      success: true,
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    return next(error);
  }
};


export const adminCreateUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = email.toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail }).exec();
    if (existing) {
      throw new ApiError(409, "Email is already in use", "EMAIL_TAKEN");
    }

    const user = new User({
      name,
      email: normalizedEmail,
      role
    });
    await user.setPassword(password);
    await user.save();

    return res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return next(error);
  }
};


export const adminUpdateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findById(id).exec();
    if (!user) {
      throw new ApiError(404, "User not found", "USER_NOT_FOUND");
    }

    user.role = role;
    await user.save();

    return res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return next(error);
  }
};


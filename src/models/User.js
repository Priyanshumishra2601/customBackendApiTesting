import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ROLES } from "../utils/roles.js";

const { Schema } = mongoose;

/**
 * User schema representing authenticated principals and their role.
 */
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.VIEWER,
      index: true
    }
  },
  { timestamps: true }
);

/**
 * Compares a plaintext password against the stored hash.
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

/**
 * Hashes and sets the password on the user document.
 * @param {string} password
 * @returns {Promise<void>}
 */
userSchema.methods.setPassword = async function setPassword(password) {
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(password, salt);
};

export const User = mongoose.model("User", userSchema);


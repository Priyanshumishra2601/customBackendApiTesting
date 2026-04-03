/* eslint-disable no-console */
import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { ROLES } from "../utils/roles.js";

dotenv.config();

/**
 * Seeds a single Admin user if it does not already exist.
 * Admin credentials can be provided via environment variables.
 */
const seedAdmin = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminPass123!";
  const adminName = process.env.ADMIN_NAME || "System Admin";

  await mongoose.connect(uri, { autoIndex: true });

  const existing = await User.findOne({ email: adminEmail }).exec();
  if (existing) {
    if (existing.role !== ROLES.ADMIN) {
      existing.role = ROLES.ADMIN;
      await existing.save();
    }
    return console.log(`Admin already exists: ${existing.email}`);
  }

  const admin = new User({
    name: adminName,
    email: adminEmail,
    role: ROLES.ADMIN
  });
  await admin.setPassword(adminPassword);
  await admin.save();

  console.log("Admin seeded successfully:");
  console.log(`  Email: ${admin.email}`);
  console.log(`  Password: ${adminPassword}`);
  console.log(`  Role: ${admin.role}`);
};

seedAdmin()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("Admin seed failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  });


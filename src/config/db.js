import mongoose from "mongoose";

/**
 * Connects to MongoDB using Mongoose.
 * @returns {Promise<void>}
 */
export const connectDb = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  await mongoose.connect(uri, {
    autoIndex: true
  });

  // eslint-disable-next-line no-console
  console.log("MongoDB connected");
};


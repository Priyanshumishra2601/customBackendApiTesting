import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import { errorMiddleware } from "./middlewares/errorMiddleware.js";

dotenv.config();


export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "*"
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false }));

  if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  //Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/transactions", transactionRoutes);
  app.use("/api/dashboard", dashboardRoutes);

  //Root route
  app.get("/", (req, res) => {
    res.send("Finance API Running 🚀");
  });

  //Health check
  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  //Error middleware (ALWAYS LAST)
  app.use(errorMiddleware);

  return app;
};
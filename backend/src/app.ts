import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import apiRoutes from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { ensureDb } from "./middleware/db.middleware";
import { env } from "./config/env";

const app = express();

const allowedOrigins = env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim());
app.use(cors({ origin: allowedOrigins ?? true, credentials: true }));

// Uploads go browser to Cloudinary directly, so bodies stay small.
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

// Health check must answer even when Mongo is down, so it sits before ensureDb.
app.get("/health", (_req, res) => {
  res.json({
    status: "OK",
    message: "Plutus Media Backend Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (_req, res) => {
  res.json({
    message: `Plutus Media Backend API v${env.VERSION}`,
    version: env.VERSION,
    status: "running",
    endpoints: { health: "/health", api: "/api" },
  });
});

app.use("/api", ensureDb, apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

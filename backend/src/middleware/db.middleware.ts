import { NextFunction, Request, Response } from "express";
import { connectDB } from "../config/database";
import { asyncHandler } from "./error.middleware";

// Cheap when warm, and routes DB failures through the normal error handler.
export const ensureDb = asyncHandler(
  async (_req: Request, _res: Response, next: NextFunction) => {
    await connectDB();
    next();
  }
);

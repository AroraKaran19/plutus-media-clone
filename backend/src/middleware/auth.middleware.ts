import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { IUser, User } from "../models/user.model";
import { AppError, asyncHandler } from "./error.middleware";

export interface AuthedRequest extends Request {
  user?: IUser;
}

export const COOKIE_NAME = "token";

export const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

export const signToken = (userId: string) =>
  jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);

// jwt.verify throws on a bad or expired token, which errorHandler maps to 401.
export const requireAuth = asyncHandler(async (req: AuthedRequest, _res: Response, next: NextFunction) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) throw new AppError("Not authenticated", 401);

  const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string };
  const user = await User.findById(payload.sub);
  if (!user) throw new AppError("Not authenticated", 401);

  req.user = user;
  next();
});

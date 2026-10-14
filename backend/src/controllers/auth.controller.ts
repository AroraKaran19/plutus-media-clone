import { Response } from "express";
import { User } from "../models/user.model";
import { loginSchema } from "../schemas/auth.schema";
import { AuthedRequest, COOKIE_NAME, cookieOptions, signToken } from "../middleware/auth.middleware";
import { AppError, asyncHandler, sendSuccessResponse } from "../middleware/error.middleware";

export const login = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  // One message for both branches so the endpoint never reveals which accounts exist.
  const invalid = new AppError("Invalid email or password", 401);
  if (!user) throw invalid;
  if (!(await user.comparePassword(password))) throw invalid;

  res.cookie(COOKIE_NAME, signToken(user._id.toString()), cookieOptions);
  sendSuccessResponse(res, { id: user._id.toString(), name: user.name, email: user.email }, "Logged in");
});

export const logout = asyncHandler(async (_req: AuthedRequest, res: Response) => {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: undefined });
  sendSuccessResponse(res, null, "Logged out");
});

export const me = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const user = req.user!;
  sendSuccessResponse(res, { id: user._id.toString(), name: user.name, email: user.email });
});

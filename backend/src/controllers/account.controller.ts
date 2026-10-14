import { Response } from "express";
import { User } from "../models/user.model";
import { passwordSchema, profileSchema } from "../schemas/account.schema";
import { AuthedRequest } from "../middleware/auth.middleware";
import { AppError, asyncHandler, sendSuccessResponse } from "../middleware/error.middleware";

export const updateProfile = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const patch = profileSchema.parse(req.body);
  const user = req.user!;

  if (patch.name !== undefined) user.name = patch.name;
  if (patch.email !== undefined) user.email = patch.email.toLowerCase();

  // A duplicate email raises E11000, which errorHandler turns into a 400.
  await user.save();

  sendSuccessResponse(res, { id: user._id.toString(), name: user.name, email: user.email }, "Profile updated");
});

export const changePassword = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { currentPassword, newPassword } = passwordSchema.parse(req.body);

  // req.user was loaded without the hash, so re-fetch it with the password selected.
  const user = await User.findById(req.user!._id).select("+password");
  if (!user) throw new AppError("Not authenticated", 401);

  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError("Current password is incorrect", 401);
  }

  user.password = newPassword;
  await user.save();

  sendSuccessResponse(res, null, "Password changed");
});

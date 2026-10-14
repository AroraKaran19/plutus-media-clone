import { Response } from "express";
import { cloudinary } from "../config/cloudinary";
import { env } from "../config/env";
import { SIGNABLE_PARAMS, destroySchema, signatureSchema } from "../schemas/media.schema";
import { AuthedRequest } from "../middleware/auth.middleware";
import { AppError, asyncHandler, sendSuccessResponse } from "../middleware/error.middleware";

export const signUpload = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { paramsToSign } = signatureSchema.parse(req.body);

  const folder = paramsToSign.folder;
  if (folder !== undefined && folder !== env.CLOUDINARY_FOLDER) {
    throw new AppError(`Uploads are confined to the "${env.CLOUDINARY_FOLDER}" folder`, 400);
  }

  const filtered: Record<string, unknown> = {};
  for (const key of SIGNABLE_PARAMS) {
    if (paramsToSign[key] !== undefined) filtered[key] = paramsToSign[key];
  }
  filtered.folder = env.CLOUDINARY_FOLDER;

  const signature = cloudinary.utils.api_sign_request(
    filtered as Record<string, string | number>,
    env.CLOUDINARY_API_SECRET
  );

  // CldUploadWidget reads `signature`; the rest serves a hand-rolled uploader.
  res.json({
    signature,
    timestamp: filtered.timestamp,
    apiKey: env.CLOUDINARY_API_KEY,
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    folder: env.CLOUDINARY_FOLDER,
  });
});

export const destroyMedia = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { publicId, resourceType } = destroySchema.parse(req.body);

  // The shipped defaults live here, and the frontend falls back to them when the API is down.
  if (publicId.startsWith(`${env.CLOUDINARY_FOLDER}/site/`)) {
    throw new AppError("Default site assets are protected and cannot be deleted", 400);
  }

  const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true });

  sendSuccessResponse(res, result, "Asset deleted");
});

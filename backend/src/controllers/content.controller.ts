import { Response } from "express";
import { SiteContent } from "../models/site-content.model";
import { AREA_SCHEMAS, ContentArea } from "../schemas/content.schema";
import { AuthedRequest } from "../middleware/auth.middleware";
import { AppError, asyncHandler, sendSuccessResponse } from "../middleware/error.middleware";
import { triggerRevalidate } from "../services/revalidate.service";

export const getContent = asyncHandler(async (_req: AuthedRequest, res: Response) => {
  const doc = await SiteContent.findOne().lean();

  // Not a server error: the frontend falls back to its shipped defaults.
  if (!doc) throw new AppError("Site content has not been seeded", 404);

  sendSuccessResponse(res, doc);
});

export const patchContentArea = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const area = req.params.area as ContentArea;

  const schema = AREA_SCHEMAS[area];
  if (!schema) {
    throw new AppError(`Unknown content area "${area}". Valid areas: ${Object.keys(AREA_SCHEMAS).join(", ")}`, 400);
  }

  const data = schema.parse(req.body);

  // The dotted key confines the write to one subtree. No upsert: an empty DB is fixed by seeding.
  const doc = await SiteContent.findOneAndUpdate(
    {},
    { $set: { [area]: data, updatedBy: req.user!._id } },
    { returnDocument: "after" }
  ).lean();

  if (!doc) throw new AppError("Site content has not been seeded", 404);

  await triggerRevalidate();

  sendSuccessResponse(res, doc, `Updated ${area}`);
});

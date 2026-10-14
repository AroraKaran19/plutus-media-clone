import { Document, Model, Schema, model, models } from "mongoose";
import { SiteContentData } from "../schemas/content.schema";

export interface ISiteContent extends Document, SiteContentData {
  updatedBy?: Schema.Types.ObjectId;
}

// Zod enforces the shape on write, so Mongoose stores each area as-is.
const siteContentSchema = new Schema<ISiteContent>(
  {
    seo: { type: Schema.Types.Mixed, required: true },
    navbar: { type: Schema.Types.Mixed, required: true },
    sections: { type: Schema.Types.Mixed, required: true },
    footer: { type: Schema.Types.Mixed, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, minimize: false }
);

export const SiteContent: Model<ISiteContent> =
  (models.SiteContent as Model<ISiteContent>) ?? model<ISiteContent>("SiteContent", siteContentSchema);

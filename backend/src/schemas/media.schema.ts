import { z } from "zod";

// Only these params may be signed, so a caller cannot smuggle extra options into the signature.
export const SIGNABLE_PARAMS = ["timestamp", "folder", "public_id", "source", "eager", "upload_preset"] as const;

export const signatureSchema = z.object({
  paramsToSign: z.record(z.string(), z.unknown()),
});

export const destroySchema = z.object({
  publicId: z.string().min(1),
  resourceType: z.enum(["image", "video"]).default("image"),
});

export type SignatureInput = z.infer<typeof signatureSchema>;
export type DestroyInput = z.infer<typeof destroySchema>;

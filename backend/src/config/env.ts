import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("5000"),
  VERSION: z.string(),

  MONGODB_URI: z.string().min(1),

  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default("7d"),

  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  CLOUDINARY_FOLDER: z.string().default("plutus-media"),

  // Optional: without these, saves still persist but the cache expires on schedule.
  FRONTEND_REVALIDATE_URL: z.string().url().optional(),
  REVALIDATE_SECRET: z.string().optional(),

  // Comma-separated sites allowed to call the API with cookies.
  ALLOWED_ORIGINS: z.string().optional(),
  // Shared parent of the site and API hosts, so both can read the login cookie.
  COOKIE_DOMAIN: z.string().optional(),
}).refine((e) => e.NODE_ENV !== "production" || !!e.ALLOWED_ORIGINS, {
  path: ["ALLOWED_ORIGINS"],
  message: "required in production",
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const missing = parsed.error.issues
    .map((i) => `  ${i.path.join(".")}: ${i.message}`)
    .join("\n");
  throw new Error(`Invalid environment variables:\n${missing}`);
}

export const env = parsed.data;

// Local only: seeds the admin user and the SiteContent document. Run with `npm run seed`.
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { env } from "../src/config/env";
import { User } from "../src/models/user.model";
import { SiteContent } from "../src/models/site-content.model";
import { siteContentSchema } from "../src/schemas/content.schema";

// Shared with the frontend so the shipped fallback and the seeded document cannot drift.
const DEFAULTS_PATH = path.resolve(__dirname, "../../frontend/lib/content/default-content.json");

const seed = async () => {
  const { SEED_ADMIN_NAME, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD } = process.env;
  if (!SEED_ADMIN_NAME || !SEED_ADMIN_EMAIL || !SEED_ADMIN_PASSWORD) {
    throw new Error("Set SEED_ADMIN_NAME, SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in backend/.env");
  }

  await mongoose.connect(env.MONGODB_URI);
  console.log("🔗 Connected");

  const existing = await User.findOne({ email: SEED_ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    console.log(`👤 Admin ${SEED_ADMIN_EMAIL} already exists, skipping`);
  } else {
    await User.create({ name: SEED_ADMIN_NAME, email: SEED_ADMIN_EMAIL, password: SEED_ADMIN_PASSWORD });
    console.log(`👤 Created admin ${SEED_ADMIN_EMAIL}`);
  }

  // Parse so defaults that drift out of the schema fail here, not on the live site.
  const content = siteContentSchema.parse(JSON.parse(fs.readFileSync(DEFAULTS_PATH, "utf-8")));

  if (await SiteContent.findOne()) {
    // Re-seeding would silently wipe every edit made in the admin.
    console.log("📄 SiteContent already exists, refusing to overwrite");
    console.log("   Delete the document manually if you want to re-seed.");
  } else {
    await SiteContent.create(content);
    console.log("📄 Seeded SiteContent from default-content.json");
  }

  await mongoose.disconnect();
  console.log("✅ Done");
};

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});

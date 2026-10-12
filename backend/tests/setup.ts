import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { afterAll, afterEach } from "vitest";

// Top-level await, not beforeAll: env.ts reads process.env on first import.
const mongo = await MongoMemoryServer.create();

process.env.NODE_ENV = "test";
process.env.VERSION = "test";
process.env.PORT = "5000";
process.env.JWT_SECRET = "test-secret-do-not-use-in-prod";
process.env.JWT_EXPIRES_IN = "7d";
process.env.CLOUDINARY_CLOUD_NAME = "test-cloud";
process.env.CLOUDINARY_API_KEY = "test-key";
process.env.CLOUDINARY_API_SECRET = "test-secret";
process.env.CLOUDINARY_FOLDER = "plutus-media-test";
process.env.MONGODB_URI = mongo.getUri();

await mongoose.connect(process.env.MONGODB_URI);

afterEach(async () => {
  const collections = await mongoose.connection.db!.collections();
  for (const c of collections) await c.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

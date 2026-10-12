import mongoose from "mongoose";
import { env } from "./env";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// globalThis survives module re-evaluation across warm serverless invocations.
const globalWithMongoose = globalThis as typeof globalThis & {
  _mongooseCache?: MongooseCache;
};

const cache: MongooseCache = globalWithMongoose._mongooseCache ?? {
  conn: null,
  promise: null,
};
globalWithMongoose._mongooseCache = cache;

export const connectDB = async (): Promise<typeof mongoose> => {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null; // let the next request retry instead of caching the failure
    throw error;
  }

  return cache.conn;
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.connection.close();
  cache.conn = null;
  cache.promise = null;
};

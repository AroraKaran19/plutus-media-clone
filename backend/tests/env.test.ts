import { describe, expect, it } from "vitest";
import { env } from "../src/config/env";

describe("env", () => {
  it("exposes the validated Cloudinary folder", () => {
    expect(env.CLOUDINARY_FOLDER).toBe("plutus-media-test");
  });

  it("exposes a JWT secret", () => {
    expect(env.JWT_SECRET).toBeTruthy();
  });
});

import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import app from "../src/app";
import { User } from "../src/models/user.model";

const CREDS = { email: "admin@example.com", password: "correct-horse-battery" };

let cookie: string[];

beforeEach(async () => {
  await User.create({ name: "Jane Doe", ...CREDS });
  const res = await request(app).post("/api/auth/login").send(CREDS);
  cookie = res.headers["set-cookie"];
});

describe("POST /api/media/signature", () => {
  it("401s without a cookie", async () => {
    const res = await request(app)
      .post("/api/media/signature")
      .send({ paramsToSign: { timestamp: 1, folder: "plutus-media-test" } });

    expect(res.status).toBe(401);
  });

  it("returns a signature for our folder", async () => {
    const res = await request(app)
      .post("/api/media/signature")
      .set("Cookie", cookie)
      .send({ paramsToSign: { timestamp: 1720000000, folder: "plutus-media-test" } });

    expect(res.status).toBe(200);
    expect(res.body.signature).toMatch(/^[a-f0-9]{40}$/);
    expect(res.body.folder).toBe("plutus-media-test");
  });

  it("refuses to sign an upload targeting a different folder", async () => {
    const res = await request(app)
      .post("/api/media/signature")
      .set("Cookie", cookie)
      .send({ paramsToSign: { timestamp: 1720000000, folder: "someone-elses-bucket" } });

    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/media", () => {
  it("401s without a cookie", async () => {
    const res = await request(app).delete("/api/media").send({ publicId: "x" });
    expect(res.status).toBe(401);
  });

  it("refuses to delete a shipped default asset", async () => {
    const res = await request(app)
      .delete("/api/media")
      .set("Cookie", cookie)
      .send({ publicId: "plutus-media-test/site/brand/logo-wordmark" });

    expect(res.status).toBe(400);
  });

  it("400s without a publicId", async () => {
    const res = await request(app).delete("/api/media").set("Cookie", cookie).send({});
    expect(res.status).toBe(400);
  });
});

import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import app from "../src/app";
import { User } from "../src/models/user.model";

const CREDS = { email: "admin@example.com", password: "correct-horse-battery" };

const seedUser = () => User.create({ name: "Jane Doe", ...CREDS });

const login = async () => {
  const res = await request(app).post("/api/auth/login").send(CREDS);
  return res.headers["set-cookie"];
};

describe("POST /api/auth/login", () => {
  beforeEach(seedUser);

  it("sets an httpOnly cookie on success", async () => {
    const res = await request(app).post("/api/auth/login").send(CREDS);

    expect(res.status).toBe(200);
    const cookie = res.headers["set-cookie"][0];
    expect(cookie).toContain("token=");
    expect(cookie).toContain("HttpOnly");
  });

  it("stores a bcrypt hash, never the plain password", async () => {
    const user = await User.findOne({ email: CREDS.email }).select("+password");
    expect(user!.password).toMatch(/^\$2/);
    expect(user!.password).not.toBe(CREDS.password);
  });

  it("never returns the password hash", async () => {
    const res = await request(app).post("/api/auth/login").send(CREDS);
    expect(JSON.stringify(res.body)).not.toContain("$2");
  });

  it("rejects a wrong password with the same message as an unknown email", async () => {
    const wrongPass = await request(app).post("/api/auth/login").send({ ...CREDS, password: "nope" });
    const unknownEmail = await request(app)
      .post("/api/auth/login")
      .send({ email: "ghost@example.com", password: CREDS.password });

    expect(wrongPass.status).toBe(401);
    expect(unknownEmail.status).toBe(401);
    expect(wrongPass.body.error.message).toBe(unknownEmail.body.error.message);
  });

  it("rejects a malformed body with 400", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "not-an-email" });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/logout", () => {
  it("clears the cookie", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"][0]).toMatch(/token=;/);
  });
});

describe("GET /api/auth/me", () => {
  beforeEach(seedUser);

  it("401s without a cookie", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("401s with a garbage cookie", async () => {
    const res = await request(app).get("/api/auth/me").set("Cookie", "token=garbage");
    expect(res.status).toBe(401);
  });

  it("returns the user when authenticated", async () => {
    const res = await request(app).get("/api/auth/me").set("Cookie", await login());

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(CREDS.email);
    expect(res.body.data.password).toBeUndefined();
  });
});

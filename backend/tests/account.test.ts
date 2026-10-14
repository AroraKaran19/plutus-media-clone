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

describe("PATCH /api/account", () => {
  it("401s without a cookie", async () => {
    const res = await request(app).patch("/api/account").send({ name: "Someone Else" });
    expect(res.status).toBe(401);
  });

  it("updates name and email", async () => {
    const res = await request(app)
      .patch("/api/account")
      .set("Cookie", cookie)
      .send({ name: "John Doe", email: "john@example.com" });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("John Doe");
    expect(res.body.data.email).toBe("john@example.com");
  });

  it("rejects an invalid email", async () => {
    const res = await request(app).patch("/api/account").set("Cookie", cookie).send({ email: "not-an-email" });
    expect(res.status).toBe(400);
  });

  it("rejects an email that another account already uses", async () => {
    await User.create({ name: "John Doe", email: "taken@example.com", password: "another-password" });
    const res = await request(app).patch("/api/account").set("Cookie", cookie).send({ email: "taken@example.com" });
    expect(res.status).toBe(400);
  });
});

describe("PATCH /api/account/password", () => {
  it("rejects a wrong current password", async () => {
    const res = await request(app)
      .patch("/api/account/password")
      .set("Cookie", cookie)
      .send({ currentPassword: "wrong", newPassword: "a-brand-new-password" });

    expect(res.status).toBe(401);
  });

  it("rejects a short new password", async () => {
    const res = await request(app)
      .patch("/api/account/password")
      .set("Cookie", cookie)
      .send({ currentPassword: CREDS.password, newPassword: "short" });

    expect(res.status).toBe(400);
  });

  it("changes the password so the old one no longer logs in", async () => {
    const change = await request(app)
      .patch("/api/account/password")
      .set("Cookie", cookie)
      .send({ currentPassword: CREDS.password, newPassword: "a-brand-new-password" });
    expect(change.status).toBe(200);

    const oldLogin = await request(app).post("/api/auth/login").send(CREDS);
    expect(oldLogin.status).toBe(401);

    const newLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: CREDS.email, password: "a-brand-new-password" });
    expect(newLogin.status).toBe(200);
  });
});

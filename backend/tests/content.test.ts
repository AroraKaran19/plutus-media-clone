import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import app from "../src/app";
import { User } from "../src/models/user.model";
import { SiteContent } from "../src/models/site-content.model";
import { AREA_SCHEMAS, MAX_CASE_STUDIES } from "../src/schemas/content.schema";
import defaults from "../../frontend/lib/content/default-content.json";

const CREDS = { email: "admin@example.com", password: "correct-horse-battery" };
const media = { url: "https://res.cloudinary.com/x/image/upload/a.png", publicId: "plutus-media/a" };

let cookie: string[];

beforeEach(async () => {
  await User.create({ name: "Jane Doe", ...CREDS });
  const res = await request(app).post("/api/auth/login").send(CREDS);
  cookie = res.headers["set-cookie"];
  await SiteContent.create(defaults);
});

const sliceOf = (area: string) =>
  area.startsWith("sections.")
    ? (defaults.sections as Record<string, unknown>)[area.split(".")[1]]
    : (defaults as Record<string, unknown>)[area];

describe("AREA_SCHEMAS", () => {
  it("covers exactly the twelve editable areas", () => {
    expect(Object.keys(AREA_SCHEMAS).sort()).toEqual([
      "footer",
      "navbar",
      "sections.about",
      "sections.benefits",
      "sections.blog",
      "sections.caseStudies",
      "sections.clients",
      "sections.cta",
      "sections.faq",
      "sections.hero",
      "sections.testimonials",
      "seo",
    ]);
  });

  it("accepts the shipped defaults", () => {
    for (const [area, schema] of Object.entries(AREA_SCHEMAS)) {
      expect(schema.safeParse(sliceOf(area)).success, `${area} failed`).toBe(true);
    }
  });

  it("rejects an unknown social platform", () => {
    const result = AREA_SCHEMAS.footer.safeParse({
      ...defaults.footer,
      socials: [{ platform: "myspace", href: "https://example.com" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects an icon outside the fixed set", () => {
    const result = AREA_SCHEMAS["sections.benefits"].safeParse({
      ...defaults.sections.benefits,
      items: [{ icon: "rocket", title: "T", body: "B" }],
    });
    expect(result.success).toBe(false);
  });
});

describe("GET /api/content", () => {
  it("is public and returns the document", async () => {
    const res = await request(app).get("/api/content");

    expect(res.status).toBe(200);
    expect(res.body.data.sections.hero.title).toBe(defaults.sections.hero.title);
  });

  it("404s when nothing is seeded", async () => {
    await SiteContent.deleteMany({});
    const res = await request(app).get("/api/content");
    expect(res.status).toBe(404);
  });
});

describe("PATCH /api/content/:area", () => {
  it("401s without a cookie", async () => {
    const res = await request(app)
      .patch("/api/content/sections.hero")
      .send({ ...defaults.sections.hero, title: "Hacked" });

    expect(res.status).toBe(401);
  });

  it("400s on an unknown area", async () => {
    const res = await request(app).patch("/api/content/sections.nonsense").set("Cookie", cookie).send({ any: true });
    expect(res.status).toBe(400);
  });

  it("400s with per-field issues when the payload fails its schema", async () => {
    const res = await request(app)
      .patch("/api/content/sections.hero")
      .set("Cookie", cookie)
      .send({ ...defaults.sections.hero, title: "" });

    expect(res.status).toBe(400);
    expect(res.body.error.fieldIssues.length).toBeGreaterThan(0);
  });

  it("writes only its own area and leaves the others untouched", async () => {
    const res = await request(app)
      .patch("/api/content/sections.hero")
      .set("Cookie", cookie)
      .send({ ...defaults.sections.hero, title: "A Brand New Title" });

    expect(res.status).toBe(200);

    const doc = await SiteContent.findOne().lean();
    expect(doc!.sections.hero.title).toBe("A Brand New Title");
    expect(doc!.sections.faq.items).toHaveLength(defaults.sections.faq.items.length);
    expect(doc!.footer.links).toHaveLength(defaults.footer.links.length);
  });

  it("404s on a write when nothing is seeded", async () => {
    await SiteContent.deleteMany({});
    const res = await request(app).patch("/api/content/seo").set("Cookie", cookie).send(defaults.seo);
    expect(res.status).toBe(404);
  });

  it(`accepts ${MAX_CASE_STUDIES} case studies but rejects one more`, async () => {
    const item = { image: media, caption: "**1M views** in a week" };
    const body = (n: number) => ({ ...defaults.sections.caseStudies, items: Array(n).fill(item) });

    const max = await request(app).patch("/api/content/sections.caseStudies").set("Cookie", cookie).send(body(8));
    expect(max.status).toBe(200);

    const over = await request(app).patch("/api/content/sections.caseStudies").set("Cookie", cookie).send(body(9));
    expect(over.status).toBe(400);
  });

  it("accepts a testimonial with only an uploaded video, or only any https link", async () => {
    const res = await request(app)
      .patch("/api/content/sections.testimonials")
      .set("Cookie", cookie)
      .send({
        ...defaults.sections.testimonials,
        videos: [
          { link: "", video: media, thumbnail: null },
          { link: "https://vimeo.com/123456", video: null, thumbnail: null },
          { link: "https://cdn.example.com/clip.mp4", video: null, thumbnail: null },
        ],
      });

    expect(res.status).toBe(200);
  });

  it("rejects a testimonial with neither a link nor an upload", async () => {
    const res = await request(app)
      .patch("/api/content/sections.testimonials")
      .set("Cookie", cookie)
      .send({ ...defaults.sections.testimonials, videos: [{ link: "", video: null, thumbnail: null }] });

    expect(res.status).toBe(400);
    expect(res.body.error.fieldIssues[0].message).toMatch(/link or upload/);
  });

  it("rejects a link that is not a URL", async () => {
    const res = await request(app)
      .patch("/api/content/sections.about")
      .set("Cookie", cookie)
      .send({ ...defaults.sections.about, video: { link: "not a link", video: null, thumbnail: null } });

    expect(res.status).toBe(400);
  });

  it("reads documents saved with the old youtubeId field", () => {
    const parsed = AREA_SCHEMAS["sections.about"].parse({
      ...defaults.sections.about,
      video: { youtubeId: "tiegD-0SDYQ", thumbnail: null },
    });
    expect(parsed.video).toEqual({ link: "tiegD-0SDYQ", video: null, thumbnail: null });
  });

  it("accepts any number of FAQs", async () => {
    const res = await request(app)
      .patch("/api/content/sections.faq")
      .set("Cookie", cookie)
      .send({ ...defaults.sections.faq, items: Array(25).fill({ question: "Q?", answer: "A." }) });

    expect(res.status).toBe(200);
  });
});

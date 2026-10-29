import { z } from "zod";

// Mirrors backend/src/schemas/content.schema.ts. The apps deploy separately, and the
// frontend must validate what it receives rather than trust the response shape.

export const CARD_ICONS = ["line-chart", "magic-wand", "persona", "chat", "sparkle", "collab"] as const;
export const VALUE_TONES = ["ice", "dark", "blush"] as const;
export const SOCIAL_PLATFORMS = ["linkedin", "x"] as const;

export const MAX_CASE_STUDIES = 8;
export const MAX_CARDS = 3;
export const MAX_BLOG_POSTS = 3;

export const mediaSchema = z.object({
  url: z.url(),
  publicId: z.string().min(1),
});

export const linkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const isVideoLink = (value: string) => /^[\w-]{11}$/.test(value) || /^https?:\/\/\S+$/i.test(value);

// Documents saved before uploads existed store the link as `youtubeId`.
const fromLegacy = (value: unknown) => {
  if (!value || typeof value !== "object" || "link" in value || !("youtubeId" in value)) return value;
  const { youtubeId, ...rest } = value as Record<string, unknown>;
  return { ...rest, link: youtubeId };
};

const videoSourceSchema = z.preprocess(
  fromLegacy,
  z
    .object({
      link: z.string().trim().default(""),
      video: mediaSchema.nullable().default(null),
      thumbnail: mediaSchema.nullable().default(null),
    })
    .refine((v) => Boolean(v.link || v.video), { path: ["link"], message: "Add a video link or upload a video" })
    .refine((v) => !v.link || isVideoLink(v.link), { path: ["link"], message: "Must be a full link starting with https://" })
);

const cardSchema = z.object({
  icon: z.enum(CARD_ICONS),
  title: z.string().min(1),
  body: z.string(),
});

export const siteContentSchema = z.object({
  seo: z.object({
    title: z.string().min(1),
    description: z.string(),
    ogImage: mediaSchema.nullable(),
  }),
  navbar: z.object({
    logo: mediaSchema.nullable(),
    items: z.array(linkSchema),
    cta: linkSchema,
  }),
  sections: z.object({
    hero: z.object({
      pill: z.string(),
      title: z.string().min(1),
      subtitle: z.string(),
      cta: linkSchema,
      note: z.string(),
      videos: z.array(z.object({ video: mediaSchema, label: z.string().min(1), views: z.string() })),
    }),
    clients: z.object({
      heading: z.string(),
      logos: z.array(z.object({ name: z.string().min(1), image: mediaSchema })),
    }),
    about: z.object({
      pill: z.string(),
      title: z.string().min(1),
      video: videoSourceSchema,
      cta: linkSchema,
    }),
    caseStudies: z.object({
      pill: z.string(),
      title: z.string().min(1),
      items: z.array(z.object({ image: mediaSchema, caption: z.string().min(1) })).max(MAX_CASE_STUDIES),
      cta: linkSchema,
    }),
    testimonials: z.object({
      pill: z.string(),
      title: z.string().min(1),
      subtitle: z.string(),
      videos: z.array(videoSourceSchema),
    }),
    benefits: z.object({
      pill: z.string(),
      title: z.string().min(1),
      items: z.array(cardSchema).max(MAX_CARDS),
      logo: mediaSchema,
      values: z.array(cardSchema.extend({ tone: z.enum(VALUE_TONES) })).max(MAX_CARDS),
    }),
    blog: z.object({
      pill: z.string(),
      title: z.string().min(1),
      posts: z
        .array(z.object({ title: z.string().min(1), href: z.string().min(1), image: mediaSchema }))
        .max(MAX_BLOG_POSTS),
      cta: linkSchema,
    }),
    faq: z.object({
      pill: z.string(),
      title: z.string().min(1),
      items: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })),
      cta: linkSchema,
    }),
    cta: z.object({
      pill: z.string(),
      title: z.string().min(1),
      titleMobile: z.string(),
      subtitle: z.string(),
      cta: linkSchema,
      note: z.string(),
    }),
  }),
  footer: z.object({
    links: z.array(linkSchema),
    socials: z
      .array(z.object({ platform: z.enum(SOCIAL_PLATFORMS), href: z.union([z.url(), z.literal("")]) }))
      .max(SOCIAL_PLATFORMS.length),
  }),
});

export type SiteContent = z.infer<typeof siteContentSchema>;
export type Sections = SiteContent["sections"];
export type Media = z.infer<typeof mediaSchema>;
export type LinkItem = z.infer<typeof linkSchema>;
export type CardIcon = (typeof CARD_ICONS)[number];
export type ValueTone = (typeof VALUE_TONES)[number];
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];
export type VideoSource = z.infer<typeof videoSourceSchema>;

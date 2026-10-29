import { z } from "zod";

export const mediaSchema = z.object({
  url: z.url(),
  publicId: z.string().min(1),
});

export const linkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

// A bare 11-character YouTube ID is accepted alongside any http(s) link.
const isVideoLink = (value: string) => /^[\w-]{11}$/.test(value) || /^https?:\/\/\S+$/i.test(value);

// Documents saved before uploads existed store the link as `youtubeId`.
const fromLegacy = (value: unknown) => {
  if (!value || typeof value !== "object" || "link" in value || !("youtubeId" in value)) return value;
  const { youtubeId, ...rest } = value as Record<string, unknown>;
  return { ...rest, link: youtubeId };
};

// An uploaded video plays when present; otherwise the link does.
const videoSourceSchema = z.preprocess(
  fromLegacy,
  z
    .object({
      link: z.string().trim().default(""),
      video: mediaSchema.nullable().default(null),
      thumbnail: mediaSchema.nullable().default(null),
    })
    .superRefine((value, ctx) => {
      if (!value.link && !value.video) {
        ctx.addIssue({ code: "custom", path: ["link"], message: "Add a video link or upload a video" });
      } else if (value.link && !isVideoLink(value.link)) {
        ctx.addIssue({ code: "custom", path: ["link"], message: "Must be a full link starting with https://" });
      }
    })
);

// Mirrored in frontend/lib/content/schema.ts, which maps each name to an icon.
export const CARD_ICONS = ["line-chart", "magic-wand", "persona", "chat", "sparkle", "collab"] as const;
export const VALUE_TONES = ["ice", "dark", "blush"] as const;
export const SOCIAL_PLATFORMS = ["linkedin", "x"] as const;

// The desktop layouts are fixed grids: 2x4 case studies, 3-column cards.
export const MAX_CASE_STUDIES = 8;
export const MAX_CARDS = 3;
export const MAX_BLOG_POSTS = 3;

export const seoSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  ogImage: mediaSchema.nullable(),
});

export const navbarSchema = z.object({
  logo: mediaSchema.nullable(),
  items: z.array(linkSchema),
  cta: linkSchema,
});

export const heroSchema = z.object({
  pill: z.string(),
  title: z.string().min(1),
  subtitle: z.string(),
  cta: linkSchema,
  note: z.string(),
  videos: z.array(
    z.object({
      video: mediaSchema,
      label: z.string().min(1),
      views: z.string(),
    })
  ),
});

export const clientsSchema = z.object({
  heading: z.string(),
  logos: z.array(z.object({ name: z.string().min(1), image: mediaSchema })),
});

export const aboutSchema = z.object({
  pill: z.string(),
  title: z.string().min(1),
  video: videoSourceSchema,
  cta: linkSchema,
});

export const caseStudiesSchema = z.object({
  pill: z.string(),
  title: z.string().min(1),
  items: z
    .array(
      z.object({
        image: mediaSchema,
        // Phrases wrapped in **double asterisks** render in the highlight colour.
        caption: z.string().min(1),
      })
    )
    .max(MAX_CASE_STUDIES, `At most ${MAX_CASE_STUDIES} case studies`),
  cta: linkSchema,
});

export const testimonialsSchema = z.object({
  pill: z.string(),
  title: z.string().min(1),
  subtitle: z.string(),
  videos: z.array(videoSourceSchema),
});

const cardSchema = z.object({
  icon: z.enum(CARD_ICONS),
  title: z.string().min(1),
  body: z.string(),
});

export const benefitsSchema = z.object({
  pill: z.string(),
  title: z.string().min(1),
  items: z.array(cardSchema).max(MAX_CARDS, `At most ${MAX_CARDS} benefits`),
  // The mark in the hub tile between the two card rows.
  logo: mediaSchema,
  values: z.array(cardSchema.extend({ tone: z.enum(VALUE_TONES) })).max(MAX_CARDS, `At most ${MAX_CARDS} values`),
});

export const blogSchema = z.object({
  pill: z.string(),
  title: z.string().min(1),
  posts: z
    .array(z.object({ title: z.string().min(1), href: z.string().min(1), image: mediaSchema }))
    .max(MAX_BLOG_POSTS, `At most ${MAX_BLOG_POSTS} posts`),
  cta: linkSchema,
});

export const faqSchema = z.object({
  pill: z.string(),
  title: z.string().min(1),
  items: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })),
  cta: linkSchema,
});

export const ctaSchema = z.object({
  pill: z.string(),
  title: z.string().min(1),
  // Shown below the desktop breakpoint, where the live site uses shorter copy.
  titleMobile: z.string(),
  subtitle: z.string(),
  cta: linkSchema,
  note: z.string(),
});

export const footerSchema = z.object({
  links: z.array(linkSchema),
  socials: z
    .array(
      z.object({
        platform: z.enum(SOCIAL_PLATFORMS),
        // Blank hides the icon rather than rendering a dead link.
        href: z.union([z.url(), z.literal("")]),
      })
    )
    .max(SOCIAL_PLATFORMS.length),
});

export const sectionsSchema = z.object({
  hero: heroSchema,
  clients: clientsSchema,
  about: aboutSchema,
  caseStudies: caseStudiesSchema,
  testimonials: testimonialsSchema,
  benefits: benefitsSchema,
  blog: blogSchema,
  faq: faqSchema,
  cta: ctaSchema,
});

export const siteContentSchema = z.object({
  seo: seoSchema,
  navbar: navbarSchema,
  sections: sectionsSchema,
  footer: footerSchema,
});

// Keys are both the URL segment (PATCH /api/content/sections.hero) and the Mongo $set path.
export const AREA_SCHEMAS = {
  seo: seoSchema,
  navbar: navbarSchema,
  footer: footerSchema,
  "sections.hero": heroSchema,
  "sections.clients": clientsSchema,
  "sections.about": aboutSchema,
  "sections.caseStudies": caseStudiesSchema,
  "sections.testimonials": testimonialsSchema,
  "sections.benefits": benefitsSchema,
  "sections.blog": blogSchema,
  "sections.faq": faqSchema,
  "sections.cta": ctaSchema,
} as const;

export type ContentArea = keyof typeof AREA_SCHEMAS;
export type SiteContentData = z.infer<typeof siteContentSchema>;

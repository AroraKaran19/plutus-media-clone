import { DEFAULT_CONTENT } from "./defaults";
import { deepMerge } from "./merge";
import { siteContentSchema, type SiteContent } from "./schema";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000";

export const CONTENT_CACHE_TAG = "site-content";

// Never throws: a dead backend, an empty database or a malformed document all fall back to the shipped copy.
export const getSiteContent = async (): Promise<SiteContent> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/content`, {
      next: { tags: [CONTENT_CACHE_TAG], revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`Content fetch failed: ${res.status}`);

    const body = await res.json();

    // Merge before validating: a document saved before a field existed is normal, not an error.
    return siteContentSchema.parse(deepMerge(DEFAULT_CONTENT, body.data));
  } catch (error) {
    console.error("[content] Falling back to DEFAULT_CONTENT:", error);
    return DEFAULT_CONTENT;
  }
};

import raw from "./default-content.json";
import { siteContentSchema, type SiteContent } from "./schema";

// Parsed rather than cast, so a typo in the shared JSON fails the build instead of the page.
export const DEFAULT_CONTENT: SiteContent = siteContentSchema.parse(raw);

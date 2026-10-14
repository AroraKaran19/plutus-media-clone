"use client";

import type { SiteContent } from "@/lib/content/schema";
import { EditorShell } from "../../_components/EditorShell";
import { Field, TextArea } from "../../_components/Field";
import { MediaUpload } from "../../_components/MediaUpload";

const SeoPage = () => (
  <EditorShell<SiteContent["seo"]>
    title="SEO"
    description="How the homepage appears in search results and link previews."
    area="seo"
    select={(content) => content.seo}
  >
    {(draft, setDraft) => (
      <>
        <Field label="Page title" required value={draft.title} onChange={(title) => setDraft((d) => ({ ...d, title }))} hint="Shown in the browser tab and as the search result headline." />
        <TextArea label="Description" rows={3} value={draft.description} onChange={(description) => setDraft((d) => ({ ...d, description }))} hint="Around 150 characters reads best in search results." />
        <MediaUpload label="OG image" value={draft.ogImage} onChange={(ogImage) => setDraft((d) => ({ ...d, ogImage }))} hint="Shown when the link is shared. 1200 × 630 works best." />
      </>
    )}
  </EditorShell>
);

export default SeoPage;

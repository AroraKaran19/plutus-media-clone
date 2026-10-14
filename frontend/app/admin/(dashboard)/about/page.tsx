"use client";

import type { Sections } from "@/lib/content/schema";
import { EditorShell } from "../../_components/EditorShell";
import { Field, LinkFields, VIDEO_LINK_HINT } from "../../_components/Field";
import { MediaUpload } from "../../_components/MediaUpload";
import { SectionHeadingFields } from "../../_components/SectionHeadingFields";

const AboutPage = () => (
  <EditorShell<Sections["about"]> title="About video" description="The heading and explainer video below the hero." area="sections.about" select={(c) => c.sections.about}>
    {(draft, setDraft) => (
      <>
        <SectionHeadingFields pill={draft.pill} title={draft.title} onPill={(pill) => setDraft((d) => ({ ...d, pill }))} onTitle={(title) => setDraft((d) => ({ ...d, title }))} />
        <Field
          label="Video link"
          type="url"
          value={draft.video.link}
          onChange={(link) => setDraft((d) => ({ ...d, video: { ...d.video, link } }))}
          placeholder="https://"
          hint={VIDEO_LINK_HINT}
        />
        <MediaUpload
          label="Or upload a video"
          resourceType="video"
          value={draft.video.video}
          onChange={(video) => setDraft((d) => ({ ...d, video: { ...d.video, video } }))}
          hint="Plays instead of the link when set."
        />
        <MediaUpload
          label="Thumbnail"
          value={draft.video.thumbnail}
          onChange={(thumbnail) => setDraft((d) => ({ ...d, video: { ...d.video, thumbnail } }))}
          hint="Optional for YouTube links and uploads, which have their own. Recommended for other links."
        />
        <LinkFields label="Button" value={draft.cta} onChange={(cta) => setDraft((d) => ({ ...d, cta }))} />
      </>
    )}
  </EditorShell>
);

export default AboutPage;

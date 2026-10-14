"use client";

import type { Sections } from "@/lib/content/schema";
import { ArrayField } from "../../_components/ArrayField";
import { EditorShell } from "../../_components/EditorShell";
import { Field, VIDEO_LINK_HINT } from "../../_components/Field";
import { MediaUpload } from "../../_components/MediaUpload";
import { SectionHeadingFields } from "../../_components/SectionHeadingFields";

type Testimonials = Sections["testimonials"];

const TestimonialsPage = () => (
  <EditorShell<Testimonials>
    title="Testimonials"
    description="The scrolling row of client video testimonials."
    area="sections.testimonials"
    select={(c) => c.sections.testimonials}
    previewHash="#testimonials"
  >
    {(draft, setDraft) => (
      <>
        <SectionHeadingFields pill={draft.pill} title={draft.title} onPill={(pill) => setDraft((d) => ({ ...d, pill }))} onTitle={(title) => setDraft((d) => ({ ...d, title }))} />
        <Field label="Subheading" value={draft.subtitle} onChange={(subtitle) => setDraft((d) => ({ ...d, subtitle }))} />
        <ArrayField<Testimonials["videos"][number]>
          label="Videos"
          items={draft.videos}
          onChange={(update) => setDraft((d) => ({ ...d, videos: update(d.videos) }))}
          create={() => ({ link: "", video: null, thumbnail: null })}
          itemLabel={(item) => (item.video ? "Uploaded video" : item.link)}
          addLabel="Add video"
          renderItem={(item, update) => (
            <>
              <Field label="Video link" type="url" value={item.link} onChange={(link) => update({ ...item, link })} placeholder="https://" hint={VIDEO_LINK_HINT} />
              <MediaUpload label="Or upload a video" resourceType="video" value={item.video} onChange={(video) => update((p) => ({ ...p, video }))} hint="Plays instead of the link when set." />
              <MediaUpload label="Thumbnail" value={item.thumbnail} onChange={(thumbnail) => update((p) => ({ ...p, thumbnail }))} hint="A vertical image fits the card best. Recommended for links other than YouTube." />
            </>
          )}
        />
      </>
    )}
  </EditorShell>
);

export default TestimonialsPage;

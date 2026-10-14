"use client";

import { MAX_CASE_STUDIES, type Media, type Sections } from "@/lib/content/schema";
import { ArrayField } from "../../_components/ArrayField";
import { EditorShell } from "../../_components/EditorShell";
import { Field, LinkFields } from "../../_components/Field";
import { MediaUpload } from "../../_components/MediaUpload";
import { SectionHeadingFields } from "../../_components/SectionHeadingFields";

type CaseStudies = Sections["caseStudies"];

const NO_MEDIA = null as unknown as Media;

const CaseStudiesPage = () => (
  <EditorShell<CaseStudies>
    title="Case studies"
    description="The photo grid of results. Two columns on desktop, filled left column first."
    area="sections.caseStudies"
    select={(c) => c.sections.caseStudies}
    previewHash="#case-studies"
  >
    {(draft, setDraft) => (
      <>
        <SectionHeadingFields pill={draft.pill} title={draft.title} onPill={(pill) => setDraft((d) => ({ ...d, pill }))} onTitle={(title) => setDraft((d) => ({ ...d, title }))} />
        <ArrayField<CaseStudies["items"][number]>
          label="Case studies"
          items={draft.items}
          max={MAX_CASE_STUDIES}
          onChange={(update) => setDraft((d) => ({ ...d, items: update(d.items) }))}
          create={() => ({ image: NO_MEDIA, caption: "" })}
          itemLabel={(item) => item.caption.replace(/\*\*/g, "")}
          addLabel="Add case study"
          renderItem={(item, update) => (
            <>
              <MediaUpload label="Photo" required value={item.image} onChange={(image) => update((p) => ({ ...p, image: image ?? NO_MEDIA }))} hint="Cropped to 352 × 200." />
              <Field
                label="Caption"
                required
                value={item.caption}
                onChange={(caption) => update({ ...item, caption })}
                hint="Wrap the result in **double asterisks** to highlight it, e.g. **10M views** in 2 months."
              />
            </>
          )}
        />
        <LinkFields label="Button" value={draft.cta} onChange={(cta) => setDraft((d) => ({ ...d, cta }))} />
      </>
    )}
  </EditorShell>
);

export default CaseStudiesPage;

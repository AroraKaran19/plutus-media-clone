"use client";

import type { Sections } from "@/lib/content/schema";
import { EditorShell } from "../../_components/EditorShell";
import { Field, LinkFields, TextArea } from "../../_components/Field";

const CtaPage = () => (
  <EditorShell<Sections["cta"]> title="Call to action" description="The closing band above the footer." area="sections.cta" select={(c) => c.sections.cta}>
    {(draft, setDraft) => (
      <>
        <Field label="Badge" value={draft.pill} onChange={(pill) => setDraft((d) => ({ ...d, pill }))} hint="Leave blank to hide." />
        <TextArea label="Headline" required rows={3} value={draft.title} onChange={(title) => setDraft((d) => ({ ...d, title }))} hint="Shown on desktop." />
        <TextArea
          label="Headline on phones and tablets"
          rows={3}
          value={draft.titleMobile}
          onChange={(titleMobile) => setDraft((d) => ({ ...d, titleMobile }))}
          hint="Shorter copy for smaller screens. Leave blank to reuse the desktop headline."
        />
        <TextArea label="Subheadline" rows={2} value={draft.subtitle} onChange={(subtitle) => setDraft((d) => ({ ...d, subtitle }))} />
        <LinkFields label="Button" value={draft.cta} onChange={(cta) => setDraft((d) => ({ ...d, cta }))} />
        <Field label="Note under the button" value={draft.note} onChange={(note) => setDraft((d) => ({ ...d, note }))} hint="Leave blank to hide." />
      </>
    )}
  </EditorShell>
);

export default CtaPage;

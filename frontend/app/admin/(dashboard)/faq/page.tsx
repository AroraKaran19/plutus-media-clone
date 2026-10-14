"use client";

import type { Sections } from "@/lib/content/schema";
import { ArrayField } from "../../_components/ArrayField";
import { EditorShell } from "../../_components/EditorShell";
import { Field, LinkFields, TextArea } from "../../_components/Field";
import { SectionHeadingFields } from "../../_components/SectionHeadingFields";

type Faq = Sections["faq"];

const FaqPage = () => (
  <EditorShell<Faq> title="FAQ" description="Questions and answers. Only one opens at a time on the site." area="sections.faq" select={(c) => c.sections.faq} previewHash="#faq">
    {(draft, setDraft) => (
      <>
        <SectionHeadingFields pill={draft.pill} title={draft.title} onPill={(pill) => setDraft((d) => ({ ...d, pill }))} onTitle={(title) => setDraft((d) => ({ ...d, title }))} />
        <ArrayField<Faq["items"][number]>
          label="Questions"
          items={draft.items}
          onChange={(update) => setDraft((d) => ({ ...d, items: update(d.items) }))}
          create={() => ({ question: "", answer: "" })}
          itemLabel={(item) => item.question}
          addLabel="Add question"
          renderItem={(item, update) => (
            <>
              <Field label="Question" required value={item.question} onChange={(question) => update({ ...item, question })} />
              <TextArea label="Answer" required rows={4} value={item.answer} onChange={(answer) => update({ ...item, answer })} />
            </>
          )}
        />
        <LinkFields label="Button" value={draft.cta} onChange={(cta) => setDraft((d) => ({ ...d, cta }))} />
      </>
    )}
  </EditorShell>
);

export default FaqPage;

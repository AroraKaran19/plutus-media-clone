"use client";

import { MAX_CARDS, VALUE_TONES, type CardIcon, type Sections, type ValueTone } from "@/lib/content/schema";
import { ArrayField } from "../../_components/ArrayField";
import { EditorShell } from "../../_components/EditorShell";
import { Field, Select, TextArea } from "../../_components/Field";
import { IconPicker } from "../../_components/IconPicker";
import { SectionHeadingFields } from "../../_components/SectionHeadingFields";

type Benefits = Sections["benefits"];

const ICON_LABELS: Record<CardIcon, string> = {
  "line-chart": "Growth chart",
  "magic-wand": "Magic wand",
  persona: "Profile card",
  chat: "Chat bubbles",
  sparkle: "Sparkle",
  collab: "Collaboration",
};

const TONE_LABELS: Record<ValueTone, string> = { ice: "Light blue", dark: "Dark", blush: "Pink gradient" };

const BenefitsPage = () => (
  <EditorShell<Benefits> title="Benefits" description="The three benefit columns and the three value cards beneath them." area="sections.benefits" select={(c) => c.sections.benefits}>
    {(draft, setDraft) => (
      <>
        <SectionHeadingFields pill={draft.pill} title={draft.title} onPill={(pill) => setDraft((d) => ({ ...d, pill }))} onTitle={(title) => setDraft((d) => ({ ...d, title }))} />

        <ArrayField<Benefits["items"][number]>
          label="Benefit columns"
          items={draft.items}
          max={MAX_CARDS}
          onChange={(update) => setDraft((d) => ({ ...d, items: update(d.items) }))}
          create={() => ({ icon: "line-chart", title: "", body: "" })}
          itemLabel={(item) => item.title}
          addLabel="Add benefit"
          renderItem={(item, update) => (
            <>
              <div className="flex flex-col gap-4">
                <IconPicker label="Icon" value={item.icon} labels={ICON_LABELS} onChange={(icon) => update({ ...item, icon })} />
                <Field label="Title" required value={item.title} onChange={(title) => update({ ...item, title })} />
              </div>
              <TextArea label="Text" rows={3} value={item.body} onChange={(body) => update({ ...item, body })} />
            </>
          )}
        />

        <ArrayField<Benefits["values"][number]>
          label="Value cards"
          items={draft.values}
          max={MAX_CARDS}
          onChange={(update) => setDraft((d) => ({ ...d, values: update(d.values) }))}
          create={() => ({ icon: "sparkle", tone: "dark", title: "", body: "" })}
          itemLabel={(item) => item.title}
          addLabel="Add value"
          renderItem={(item, update) => (
            <>
              <div className="flex flex-col gap-4">
                <IconPicker label="Icon" value={item.icon} labels={ICON_LABELS} onChange={(icon) => update({ ...item, icon })} />
                <Select label="Card style" value={item.tone} options={VALUE_TONES} labels={TONE_LABELS} onChange={(tone) => update({ ...item, tone })} />
                <Field label="Title" required value={item.title} onChange={(title) => update({ ...item, title })} />
              </div>
              <TextArea label="Text" rows={3} value={item.body} onChange={(body) => update({ ...item, body })} />
            </>
          )}
        />
      </>
    )}
  </EditorShell>
);

export default BenefitsPage;

"use client";

import type { Media, Sections } from "@/lib/content/schema";
import { ArrayField } from "../../_components/ArrayField";
import { EditorShell } from "../../_components/EditorShell";
import { Field, LinkFields, TextArea } from "../../_components/Field";
import { MediaUpload } from "../../_components/MediaUpload";

type Hero = Sections["hero"];

// A new row saves only once its video is uploaded; the backend names the missing field otherwise.
const NO_MEDIA = null as unknown as Media;

const HeroPage = () => (
  <EditorShell<Hero> title="Hero" description="The first screen: headline, call to action and the video strip." area="sections.hero" select={(c) => c.sections.hero}>
    {(draft, setDraft) => (
      <>
        <Field label="Badge" value={draft.pill} onChange={(pill) => setDraft((d) => ({ ...d, pill }))} hint="The small pill above the headline. Leave blank to hide." />
        <TextArea label="Headline" required rows={2} value={draft.title} onChange={(title) => setDraft((d) => ({ ...d, title }))} />
        <TextArea label="Subheadline" rows={2} value={draft.subtitle} onChange={(subtitle) => setDraft((d) => ({ ...d, subtitle }))} />
        <LinkFields label="Button" value={draft.cta} onChange={(cta) => setDraft((d) => ({ ...d, cta }))} />
        <Field label="Note under the button" value={draft.note} onChange={(note) => setDraft((d) => ({ ...d, note }))} hint="Leave blank to hide the clock line." />

        <ArrayField<Hero["videos"][number]>
          label="Video strip"
          items={draft.videos}
          onChange={(update) => setDraft((d) => ({ ...d, videos: update(d.videos) }))}
          create={() => ({ video: NO_MEDIA, label: "", views: "" })}
          itemLabel={(item) => item.label}
          addLabel="Add video"
          hint="Short vertical videos that scroll under the hero. Muted and looped."
          renderItem={(item, update) => (
            <>
              <MediaUpload label="Video" resourceType="video" required value={item.video} onChange={(video) => update((p) => ({ ...p, video: video ?? NO_MEDIA }))} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="App name" required value={item.label} onChange={(label) => update({ ...item, label })} hint="Used for accessibility, not shown." />
                <Field label="View count" value={item.views} onChange={(views) => update({ ...item, views })} placeholder="12.6M" />
              </div>
            </>
          )}
        />
      </>
    )}
  </EditorShell>
);

export default HeroPage;

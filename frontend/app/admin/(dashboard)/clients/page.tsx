"use client";

import type { Media, Sections } from "@/lib/content/schema";
import { ArrayField } from "../../_components/ArrayField";
import { EditorShell } from "../../_components/EditorShell";
import { Field } from "../../_components/Field";
import { MediaUpload } from "../../_components/MediaUpload";

type Clients = Sections["clients"];

const NO_MEDIA = null as unknown as Media;

const ClientsPage = () => (
  <EditorShell<Clients> title="Client logos" description="The scrolling logo row under the hero videos." area="sections.clients" select={(c) => c.sections.clients}>
    {(draft, setDraft) => (
      <>
        <Field label="Heading" value={draft.heading} onChange={(heading) => setDraft((d) => ({ ...d, heading }))} />
        <ArrayField<Clients["logos"][number]>
          label="Logos"
          items={draft.logos}
          onChange={(update) => setDraft((d) => ({ ...d, logos: update(d.logos) }))}
          create={() => ({ name: "", image: NO_MEDIA })}
          itemLabel={(item) => item.name}
          addLabel="Add logo"
          hint="Square app icons around 100 × 100 look best."
          renderItem={(item, update) => (
            <>
              <MediaUpload label="Logo" required value={item.image} onChange={(image) => update((p) => ({ ...p, image: image ?? NO_MEDIA }))} />
              <Field label="Company name" required value={item.name} onChange={(name) => update({ ...item, name })} hint="Read out by screen readers." />
            </>
          )}
        />
      </>
    )}
  </EditorShell>
);

export default ClientsPage;

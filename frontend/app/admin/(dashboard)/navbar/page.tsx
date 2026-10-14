"use client";

import type { LinkItem, SiteContent } from "@/lib/content/schema";
import { ArrayField } from "../../_components/ArrayField";
import { EditorShell } from "../../_components/EditorShell";
import { Field, LinkFields } from "../../_components/Field";
import { MediaUpload } from "../../_components/MediaUpload";

const NavbarPage = () => (
  <EditorShell<SiteContent["navbar"]>
    title="Navigation"
    description="The floating bar at the top of the page. The logo is also used in the footer."
    area="navbar"
    select={(content) => content.navbar}
  >
    {(draft, setDraft) => (
      <>
        <MediaUpload label="Logo" value={draft.logo} onChange={(logo) => setDraft((d) => ({ ...d, logo }))} hint="A white logo on a transparent background." />
        <ArrayField<LinkItem>
          label="Links"
          items={draft.items}
          onChange={(update) => setDraft((d) => ({ ...d, items: update(d.items) }))}
          create={() => ({ label: "", href: "#" })}
          itemLabel={(item) => item.label}
          addLabel="Add link"
          hint="Use #testimonials, #case-studies or #faq to jump to a section."
          renderItem={(item, update) => (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Text" required value={item.label} onChange={(label) => update({ ...item, label })} />
              <Field label="Link" required value={item.href} onChange={(href) => update({ ...item, href })} />
            </div>
          )}
        />
        <LinkFields label="Button" value={draft.cta} onChange={(cta) => setDraft((d) => ({ ...d, cta }))} hint="Desktop only." />
      </>
    )}
  </EditorShell>
);

export default NavbarPage;

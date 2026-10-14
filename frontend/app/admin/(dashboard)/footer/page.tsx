"use client";

import { SOCIAL_PLATFORMS, type LinkItem, type SiteContent, type SocialPlatform } from "@/lib/content/schema";
import { ArrayField } from "../../_components/ArrayField";
import { EditorShell } from "../../_components/EditorShell";
import { Field } from "../../_components/Field";

const PLATFORM_LABELS: Record<SocialPlatform, string> = { linkedin: "LinkedIn", x: "X (Twitter)" };

const FooterPage = () => (
  <EditorShell<SiteContent["footer"]>
    title="Footer"
    description="Footer links and social profiles."
    area="footer"
    select={(content) => content.footer}
    previewHash="#faq"
  >
    {(draft, setDraft) => {
      const hrefFor = (platform: SocialPlatform) => draft.socials.find((s) => s.platform === platform)?.href ?? "";
      // The platform set is fixed to the icons the site has; editors change URLs only.
      const setSocial = (platform: SocialPlatform, href: string) =>
        setDraft((d) => ({
          ...d,
          socials: SOCIAL_PLATFORMS.map((p) => ({ platform: p, href: p === platform ? href : (d.socials.find((s) => s.platform === p)?.href ?? "") })),
        }));

      return (
        <>
          <ArrayField<LinkItem>
            label="Links"
            items={draft.links}
            onChange={(update) => setDraft((d) => ({ ...d, links: update(d.links) }))}
            create={() => ({ label: "", href: "#" })}
            itemLabel={(item) => item.label}
            addLabel="Add link"
            renderItem={(item, update) => (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Text" required value={item.label} onChange={(label) => update({ ...item, label })} />
                <Field label="Link" required value={item.href} onChange={(href) => update({ ...item, href })} />
              </div>
            )}
          />
          <div className="flex flex-col gap-4 border-t border-[#eef0f6] pt-6">
            <p className="text-ink text-sm font-semibold">
              Social profiles <span className="font-normal text-[#6b7189]">(leave blank to hide the icon)</span>
            </p>
            {SOCIAL_PLATFORMS.map((platform) => (
              <Field key={platform} label={PLATFORM_LABELS[platform]} type="url" value={hrefFor(platform)} onChange={(href) => setSocial(platform, href)} placeholder="https://" />
            ))}
          </div>
        </>
      );
    }}
  </EditorShell>
);

export default FooterPage;

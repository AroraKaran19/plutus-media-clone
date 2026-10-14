import { CldImage } from "./cld-image";
import { assetId } from "@/app/utils/cloudinary";
import type { Media, Sections, SiteContent, SocialPlatform } from "@/lib/content/schema";
import { LinkedIn, XLogo } from "./icons";
import { BookingCta, SectionPill, linkTarget } from "./ui";

const socialIcons: Record<SocialPlatform, typeof LinkedIn> = { linkedin: LinkedIn, x: XLogo };
const socialLabels: Record<SocialPlatform, string> = { linkedin: "LinkedIn", x: "X" };

type Props = { cta: Sections["cta"]; footer: SiteContent["footer"]; logo: Media | null };

export const CtaFooter = ({ cta, footer, logo }: Props) => (
  <footer className="border-line relative isolate overflow-hidden border-t">
    <CldImage src={assetId("backgrounds/hero-bg")} alt="" fill sizes="100vw" className="-z-10 object-cover object-top" />

    <div className="reveal mx-auto flex max-w-[1180px] flex-col items-center px-5 pt-20 pb-[58px] text-center lg:pb-[90px]">
      {cta.pill && <SectionPill>{cta.pill}</SectionPill>}
      <h2 className="font-display text-gradient-heading mt-5 text-[55px]/[60.5px] font-medium tracking-[-0.02em]">
        <span className="lg:hidden">{cta.titleMobile || cta.title}</span>
        <span className="max-lg:hidden">{cta.title}</span>
      </h2>
      {cta.subtitle && (
        <p className="text-gradient-body mt-5 max-w-[620px] text-xl/[30px] font-medium tracking-[-0.02em] lg:text-2xl/9">{cta.subtitle}</p>
      )}
      <BookingCta cta={cta.cta} note={cta.note} className="mt-10" />
    </div>

    <div className="border-line border-t">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-[35px] px-5 pt-10 pb-[30px] lg:flex-row lg:justify-between lg:gap-0 lg:py-[35px]">
        <a href="#top" aria-label="Back to top" className="shrink-0">
          {logo && <CldImage src={logo.publicId} alt="" width={165} height={22} className="h-[22px] w-[165px] object-contain" />}
        </a>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-2.5 gap-y-2">
            {footer.links.map((link, i) => (
              <li key={`${link.label}-${i}`}>
                <a
                  href={link.href}
                  {...linkTarget(link.href)}
                  className="text-base/[19.2px] font-medium tracking-[-0.02em] text-white transition-opacity hover:opacity-70"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="flex gap-2.5">
          {footer.socials
            .filter((s) => s.href)
            .map((social) => {
              const Icon = socialIcons[social.platform];
              return (
                <li key={social.platform}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={socialLabels[social.platform]}
                    className="border-line grid size-[38px] place-items-center rounded-full border text-white transition-colors hover:bg-white/5"
                  >
                    <Icon className="size-[18px]" />
                  </a>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  </footer>
);

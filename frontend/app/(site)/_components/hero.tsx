import { CldImage } from "./cld-image";
import { assetId } from "@/app/utils/cloudinary";
import type { Sections } from "@/lib/content/schema";
import { HeroVideo } from "./hero-video";
import { PlayOutline } from "./icons";
import { BookingCta, Marquee, SectionPill } from "./ui";

type Props = { hero: Sections["hero"]; clients: Sections["clients"] };

export const Hero = ({ hero, clients }: Props) => (
  <section id="top" className="relative isolate overflow-hidden pt-[142px] pb-[76px] md:pt-[162px] md:pb-[53px] lg:pt-[169px] lg:pb-11">
    <CldImage
      src={assetId("backgrounds/hero-bg")}
      alt=""
      fill
      priority
      sizes="100vw"
      className="-z-10 object-cover object-top"
    />

    <div className="mx-auto flex max-w-[1100px] flex-col items-center px-5 text-center">
      {hero.pill && <SectionPill className="animate-[fade-up_0.7s_ease-out_both]">{hero.pill}</SectionPill>}
      <h1 className="font-display text-gradient-heading mt-6 text-[30px]/[33px] font-medium tracking-[-0.02em] md:text-[45px]/[49.5px] lg:max-w-[1060px] lg:text-[55px]/[60.5px] animate-[fade-up_0.7s_0.1s_ease-out_both]">
        {hero.title}
      </h1>
      <p className="text-ice mt-6 max-w-[620px] text-xl/[30px] md:text-[22px]/[33px] lg:text-xl/[30px] animate-[fade-up_0.7s_0.2s_ease-out_both]">
        {hero.subtitle}
      </p>
      <BookingCta cta={hero.cta} note={hero.note} className="mt-[30px] md:mt-10 animate-[fade-up_0.7s_0.3s_ease-out_both]" />
    </div>

    {hero.videos.length > 0 && (
      <Marquee gap={10} duration={176} copies={2} fade reverse className="mx-auto mt-[45px] max-w-[1160px]" label="Client videos">
        {hero.videos.map((item, i) => (
          <li key={`${item.video.publicId}-${i}`} className="border-line relative h-[460px] w-[283px] shrink-0 overflow-hidden rounded-[15px] border">
            <HeroVideo publicId={item.video.publicId} label={item.label} />
            {item.views && (
              <p className="border-line bg-ink absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-[30px] border px-3 py-1.5">
                <PlayOutline className="size-[18px] text-white" />
                <span className="font-display text-gradient-heading text-xl/5 font-medium tracking-[-0.02em]">{item.views}</span>
              </p>
            )}
          </li>
        ))}
      </Marquee>
    )}

    {clients.heading && (
      <p className="font-display text-frost reveal mt-[85px] text-center text-base leading-none font-medium tracking-[-0.02em]">
        {clients.heading}
      </p>
    )}
    {clients.logos.length > 0 && (
      <Marquee gap={90} duration={77} fade className="mx-auto mt-7 max-w-[1160px]" label="Clients">
        {clients.logos.map((logo, i) => (
          <li key={`${logo.image.publicId}-${i}`} className="flex h-[55px] shrink-0 items-center">
            <CldImage
              src={logo.image.publicId}
              alt={logo.name}
              width={110}
              height={55}
              className="max-w-[184px] rounded-[12px] object-contain"
              style={{ height: 55, width: "auto" }}
            />
          </li>
        ))}
      </Marquee>
    )}
  </section>
);

import type { Sections } from "@/lib/content/schema";
import { CtaButton, SectionPill } from "./ui";
import { VideoFacade } from "./video-facade";

export const About = ({ about }: { about: Sections["about"] }) => (
  <section className="relative pt-[57px] pb-[111px] md:pb-[77px] lg:pb-14">
    <div className="reveal mx-auto flex max-w-[768px] flex-col items-center gap-5 px-5 text-center lg:max-w-[960px]">
      {about.pill && <SectionPill>{about.pill}</SectionPill>}
      <h2 className="font-display text-gradient-heading text-[30px]/[33px] font-medium tracking-[-0.02em] md:text-[45px]/[49.5px] lg:text-[55px]/[60.5px]">
        {about.title}
      </h2>
    </div>

    <div className="reveal relative mx-2 mt-5 md:mx-[34px] lg:mx-auto lg:max-w-[1107px]">
      <div
        aria-hidden="true"
        className="absolute inset-x-[-6%] top-[14%] h-[64%] bg-[linear-gradient(#fabcbc,#ff6c69_49.6%,#7478ff)] opacity-[0.23] blur-[125px]"
      />
      <div className="relative aspect-[2/1] overflow-hidden rounded-[15px] bg-black lg:aspect-[1107/519]">
        <VideoFacade
          source={about.video}
          title={about.title}
          sizes="(min-width: 1200px) 1107px, 100vw"
        />
      </div>
    </div>

    <div className="mt-5 flex justify-center">
      <CtaButton link={about.cta} />
    </div>
  </section>
);

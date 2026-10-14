"use client";

import { useState } from "react";
import type { Sections } from "@/lib/content/schema";
import { Marquee, SectionHeader } from "./ui";
import { VideoFacade } from "./video-facade";

export const Testimonials = ({ testimonials }: { testimonials: Sections["testimonials"] }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <section id="testimonials" className="scroll-mt-5 pt-[33px] pb-9">
      <SectionHeader pill={testimonials.pill} title={testimonials.title} />
      {testimonials.subtitle && (
        <p className="text-ice reveal mx-auto mt-5 max-w-[1160px] px-5 text-center text-lg/[27px] font-medium tracking-[-0.02em] md:text-lg/[27px] lg:text-xl/[30px]">
          {testimonials.subtitle}
        </p>
      )}

      {testimonials.videos.length > 0 && (
        <Marquee gap={10} duration={191} fade paused={playing} className="mx-auto mt-[23px] max-w-[1160px]" label="Client video testimonials">
          {testimonials.videos.map((video, i) => (
            <li key={`${video.link || video.video?.publicId}-${i}`} className="h-[464px] w-[263px] shrink-0 overflow-hidden bg-black">
              <VideoFacade
                source={video}
                title={`Client testimonial ${i + 1}`}
                sizes="263px"
                onPlay={() => setPlaying(true)}
              />
            </li>
          ))}
        </Marquee>
      )}
    </section>
  );
};

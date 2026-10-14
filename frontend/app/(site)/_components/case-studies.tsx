import { CldImage } from "./cld-image";
import { cn } from "@/app/utils";
import { assetId } from "@/app/utils/cloudinary";
import type { Sections } from "@/lib/content/schema";
import { CtaButton, SectionHeader } from "./ui";

type CaseStudy = Sections["caseStudies"]["items"][number];

// Phrases wrapped in **double asterisks** are highlighted; odd split indexes are the wrapped parts.
const captionSegments = (caption: string) =>
  caption.split(/\*\*(.+?)\*\*/).map((text, i) => ({ text, highlight: i % 2 === 1 })).filter((s) => s.text);

// The live site stacks the left column first, so desktop fills the grid column by column.
const columnOrder = (items: CaseStudy[]) => {
  const half = Math.ceil(items.length / 2);
  return [...items.filter((_, i) => i % 2 === 0), ...items.filter((_, i) => i % 2 === 1)].slice(0, half * 2);
};

export const CaseStudies = ({ caseStudies }: { caseStudies: Sections["caseStudies"] }) => {
  const rows = Math.ceil(caseStudies.items.length / 2);
  return (
    <section id="case-studies" className="scroll-mt-5 px-[3px] pb-[132px] md:px-5 md:pb-6 lg:pb-[27px]">
      <SectionHeader pill={caseStudies.pill} title={caseStudies.title} />

      {caseStudies.items.length > 0 && (
        <div className="border-line relative isolate mx-auto mt-10 max-w-[1160px] overflow-hidden rounded-[15px] border bg-[linear-gradient(#050722,#03051c)]">
          <CldImage src={assetId("backgrounds/case-studies-bg")} alt="" fill sizes="(min-width: 1200px) 1160px, 100vw" className="-z-10 object-cover" />
          <ul
            className="grid justify-items-center gap-y-[89px] pt-[47px] pb-[30px] md:pt-[39px] md:pb-6 lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-(--rows) lg:px-[50px] lg:pb-11"
            style={{ "--rows": `repeat(${rows}, auto)` } as React.CSSProperties}
          >
            {columnOrder(caseStudies.items).map((study, i) => (
              <li key={`${study.image.publicId}-${i}`} className="reveal flex w-[352px] flex-col items-center">
                <CldImage
                  src={study.image.publicId}
                  alt=""
                  width={352}
                  height={200}
                  crop="fill"
                  gravity="auto"
                  sizes="352px"
                  className="h-[200px] w-[352px] rounded-[10px] object-cover"
                />
                <p className="border-line-soft bg-caption text-highlight -mt-px rounded-[15px] border px-3 py-[3px] text-[11.5px]/[18px] font-semibold tracking-[-0.02em] whitespace-nowrap italic backdrop-blur-[50px] md:text-[15px]/[22.5px]">
                  {captionSegments(study.caption).map((segment, j) => (
                    <span key={j} className={cn(!segment.highlight && "text-white")}>
                      {segment.text}
                    </span>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-[25px] flex justify-center">
        <CtaButton link={caseStudies.cta} />
      </div>
    </section>
  );
};

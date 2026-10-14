"use client";

import { useId, useState } from "react";
import { cn } from "@/app/utils";
import type { Sections } from "@/lib/content/schema";
import { CtaButton, SectionHeader } from "./ui";

export const Faq = ({ faq }: { faq: Sections["faq"] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section id="faq" className="scroll-mt-5 pt-20 pb-[39px] md:pb-[57px] lg:pb-[82px]">
      <SectionHeader pill={faq.pill} title={faq.title} />

      <ul className="mx-auto mt-10 flex max-w-[740px] flex-col gap-2 px-5">
        {faq.items.map((item, i) => {
          const open = openIndex === i;
          const panelId = `${baseId}-panel-${i}`;
          return (
            <li
              key={`${item.question}-${i}`}
              className={cn(
                "border-line rounded-[15px] border transition-colors duration-300",
                open ? "bg-faq-open" : "bg-[linear-gradient(#050722,#03051c)]",
              )}
            >
              <h3>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex min-h-[62px] w-full items-center gap-4 py-[19px] pr-5 pl-6 text-left"
                >
                  <span
                    className={cn(
                      "font-display flex-1 text-xl/6 font-medium tracking-[-0.02em] transition-colors",
                      open ? "text-white" : "text-ice",
                    )}
                  >
                    {item.question}
                  </span>
                  <span aria-hidden="true" className={cn("relative size-4 shrink-0 transition-transform duration-300", open && "rotate-45")}>
                    <span className="bg-ice absolute top-1/2 left-0 h-0.5 w-4 -translate-y-1/2 rounded-[10px]" />
                    <span className="bg-ice absolute top-0 left-1/2 h-4 w-0.5 -translate-x-1/2 rounded-[10px]" />
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                className={cn("grid transition-[grid-template-rows] duration-300", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
              >
                <p className="overflow-hidden px-6 text-lg/[27px] text-white" inert={!open}>
                  <span className="block pb-6">{item.answer}</span>
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-[30px] flex justify-center">
        <CtaButton link={faq.cta} />
      </div>
    </section>
  );
};

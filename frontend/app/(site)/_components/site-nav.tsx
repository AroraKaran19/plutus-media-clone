"use client";

import { useEffect, useRef, useState } from "react";
import { CldImage } from "next-cloudinary";
import { cn } from "@/app/utils";
import type { SiteContent } from "@/lib/content/schema";
import { CtaButton, linkTarget as linkProps } from "./ui";

export const SiteNav = ({ navbar }: { navbar: SiteContent["navbar"] }) => {
  const navLinks = navbar.items;
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="absolute inset-x-5 top-5 z-50 mx-auto max-w-[931px]">
      <nav
        aria-label="Main"
        className="border-line rounded-[20px] border bg-[rgb(161_186_221/0.1)] backdrop-blur-[10px] lg:rounded-[40px]"
      >
        <div className="flex h-[60px] items-center justify-between px-5 lg:h-[67px] lg:pr-[15px] lg:pl-[30px]">
          <a href="#top" aria-label="Plutus Media home" className="shrink-0">
            {navbar.logo && (
              <CldImage src={navbar.logo.publicId} alt="" width={165} height={22} priority className="h-[22px] w-[165px] object-contain" />
            )}
          </a>

          <span aria-hidden="true" className="bg-divider mx-[35px] hidden h-[26px] w-px lg:block" />

          <ul className="mr-auto hidden items-center gap-9 lg:flex">
            {navLinks.map((link, i) => (
              <li key={`${link.label}-${i}`}>
                <a
                  href={link.href}
                  {...linkProps(link.href)}
                  className="text-base/[19.2px] font-medium tracking-[-0.02em] text-white transition-opacity hover:opacity-70"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <CtaButton link={navbar.cta} size="sm" className="hidden lg:inline-flex" />

          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="text-mist relative grid size-10 place-items-center lg:hidden"
          >
            <span className={cn("absolute h-[1.5px] w-5 bg-current transition-transform duration-300", open ? "rotate-45" : "-translate-y-[3.5px]")} />
            <span className={cn("absolute h-[1.5px] w-5 bg-current transition-transform duration-300", open ? "-rotate-45" : "translate-y-[3.5px]")} />
          </button>
        </div>

        <div
          id="mobile-menu"
          className={cn("grid transition-[grid-template-rows] duration-300 lg:hidden", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
        >
          <ul className="flex flex-col items-center gap-5 overflow-hidden" inert={!open}>
            {navLinks.map((link, i) => (
              <li key={`${link.label}-${i}`} className={cn(i === navLinks.length - 1 && "pb-7")}>
                <a
                  href={link.href}
                  {...linkProps(link.href)}
                  onClick={() => setOpen(false)}
                  className="font-display text-lg/6 font-medium tracking-[-0.02em] text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

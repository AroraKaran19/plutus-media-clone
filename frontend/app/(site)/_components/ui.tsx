import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/app/utils";
import { assetId, imageUrl } from "@/app/utils/cloudinary";
import type { LinkItem } from "@/lib/content/schema";
import { ArrowRight, Clock } from "./icons";

export const Container = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cn("mx-auto w-full max-w-[1200px] px-5", className)}>{children}</div>
);

export const SectionPill = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p
    className={cn(
      "glass-pill font-display text-frost inline-flex h-9 items-center rounded-full px-4 text-base leading-none font-medium tracking-[-0.02em]",
      className,
    )}
  >
    {children}
  </p>
);

export const SectionHeading = ({ children, className, as: Tag = "h2" }: { children: ReactNode; className?: string; as?: "h1" | "h2" }) => (
  <Tag
    className={cn(
      "font-display text-gradient-heading mx-auto text-center text-[30px]/[36px] font-medium tracking-[-0.02em] md:text-[40px]/[48px] lg:text-[50px]/[60px]",
      className,
    )}
  >
    {children}
  </Tag>
);

export const SectionHeader = ({ pill, title, className }: { pill: string; title: ReactNode; className?: string }) => (
  <div className={cn("reveal flex flex-col items-center gap-5", className)}>
    <SectionPill>{pill}</SectionPill>
    <SectionHeading>{title}</SectionHeading>
  </div>
);

type CtaProps = {
  link: LinkItem;
  size?: "md" | "sm";
  className?: string;
};

export const linkTarget = (href: string) =>
  href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};

export const CtaButton = ({ link, size = "md", className }: CtaProps) => {
  return (
    <a
      href={link.href}
      {...linkTarget(link.href)}
      style={{ "--cta-bg": `url(${imageUrl(assetId("backgrounds/cta-button-gradient"), 520)})` } as CSSProperties}
      className={cn(
        "font-display text-ink inline-flex shrink-0 items-center rounded-full bg-(image:--cta-bg) bg-size-[100%_100%] bg-center tracking-[-0.02em] transition-[background-size,transform] duration-300 hover:bg-size-[160%_100%] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ice",
        size === "md" ? "h-[50px] gap-3 pr-5 pl-[22px] text-lg/[21.6px]" : "h-[39px] gap-2.5 pr-4 pl-[18px] text-base/[19.2px]",
        className,
      )}
    >
      {link.label}
      <ArrowRight className={size === "md" ? "h-3 w-4" : "h-2.5 w-[13px]"} />
    </a>
  );
};

export const BookingCta = ({ cta, note, className }: { cta: LinkItem; note: string; className?: string }) => (
  <div className={cn("flex flex-col items-center gap-[15px]", className)}>
    <CtaButton link={cta} />
    {note && (
      <p className="flex items-center gap-2 text-base/6">
        <Clock className="text-mist h-5 w-[21px]" />
        <span className="text-gradient-body">{note}</span>
      </p>
    )}
  </div>
);

type MarqueeProps = {
  children: ReactNode;
  gap: number;
  duration: number;
  copies?: number;
  reverse?: boolean;
  paused?: boolean;
  fade?: boolean;
  className?: string;
  label?: string;
};

export const Marquee = ({ children, gap, duration, copies = 1, reverse, paused, fade, className, label }: MarqueeProps) => {
  const half = Array.from({ length: copies }, () => children);
  const trackStyle = { gap, paddingRight: gap };
  return (
    <div className={cn("overflow-hidden", fade && "edge-fade", className)}>
      <div
        className="animate-marquee flex w-max hover:[animation-play-state:paused]"
        style={
          {
            "--marquee-duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : undefined,
            animationPlayState: paused ? "paused" : undefined,
          } as CSSProperties
        }
      >
        <ul className="flex shrink-0" style={trackStyle} aria-label={label}>
          {half}
        </ul>
        <ul className="flex shrink-0" style={trackStyle} aria-hidden="true" inert>
          {half}
        </ul>
      </div>
    </div>
  );
};

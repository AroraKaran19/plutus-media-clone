import { CldImage } from "./cld-image";
import { cn } from "@/app/utils";
import { assetId } from "@/app/utils/cloudinary";
import type { Sections, ValueTone } from "@/lib/content/schema";
import { CARD_ICON_COMPONENTS } from "./icons";
import { SectionHeader } from "./ui";

const valueTone: Record<ValueTone, string> = {
  ice: "card-ice border-line-light text-ink",
  dark: "card-dark border-line text-ice",
  blush: "card-blush border-line-light text-ink",
};

const Dot = ({ className }: { className?: string }) => (
  <span className={cn("bg-line absolute size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full", className)} />
);

const Branch = ({ flip }: { flip?: boolean }) => (
  <div aria-hidden="true" className={cn("relative hidden h-[88px] lg:block", flip && "rotate-180")}>
    {["left-[calc(50%-426px)]", "left-1/2", "left-[calc(50%+426px)]"].map((x) => (
      <span key={x} className={cn("bg-line absolute top-0 h-full w-px", x)} />
    ))}
    <span className="bg-line absolute bottom-0 left-[calc(50%-426px)] h-px w-[852px]" />
    <Dot className="bottom-0 left-[calc(50%-426px)] translate-y-1/2" />
    <Dot className="bottom-0 left-1/2 translate-y-1/2" />
    <Dot className="bottom-0 left-[calc(50%+426px)] translate-y-1/2" />
  </div>
);

const Stem = ({ className }: { className?: string }) => (
  <div aria-hidden="true" className={cn("bg-line mx-auto h-20 w-px lg:h-[59px]", className)} />
);

export const Benefits = ({ benefits }: { benefits: Sections["benefits"] }) => (
  <section className="pt-20 pb-[22px] md:pb-0 lg:pb-[30px]">
    <SectionHeader pill={benefits.pill} title={benefits.title} />

    <div className="mx-auto mt-10 max-w-[1200px] px-5">
      {benefits.items.length > 0 && (
        <ul className="border-line divide-line reveal grid overflow-hidden rounded-[15px] border max-lg:divide-y lg:grid-cols-3 lg:divide-x">
          {benefits.items.map((item, i) => {
            const Icon = CARD_ICON_COMPONENTS[item.icon];
            return (
              <li key={`${item.title}-${i}`} className="card-dark flex flex-col p-8 text-center">
                <Icon className="mx-auto size-10 text-[#e1edff] lg:mx-0" />
                <h3 className="font-display text-gradient-heading mt-12 text-[23px]/[27.6px] font-medium tracking-[-0.02em] md:text-[25px]/[30px]">
                  {item.title}
                </h3>
                <p className="text-gradient-body mt-3 text-lg/[27px] font-medium tracking-[-0.02em]">{item.body}</p>
              </li>
            );
          })}
        </ul>
      )}

      <Branch />
      <Stem />
      <div className="mx-auto grid size-[132px] place-items-center rounded-[38px] bg-[#070920] shadow-[0_0_40px_rgb(40_44_94/0.35)]">
        <div className="grid size-[110px] place-items-center rounded-[32px] bg-[#0f1129]">
          <div className="grid size-[86px] place-items-center rounded-[24px] bg-[#1b1d35]">
            <CldImage src={assetId("brand/logo-mark-benefits")} alt="Plutus Media" width={54} height={51} className="h-[51px] w-[54px]" />
          </div>
        </div>
      </div>
      <Stem />
      <Branch flip />

      {benefits.values.length > 0 && (
        <ul className="grid gap-4 lg:grid-cols-3">
          {benefits.values.map((item, i) => {
            const Icon = CARD_ICON_COMPONENTS[item.icon];
            return (
              <li key={`${item.title}-${i}`} className={cn("reveal flex flex-col rounded-[15px] border p-[30px] text-center", valueTone[item.tone])}>
                <Icon className="mx-auto size-[30px]" />
                <h3 className="font-display mt-[49px] text-[23px]/[27.6px] font-medium tracking-[-0.02em] md:text-[25px]/[30px]">{item.title}</h3>
                <p className={cn("mt-3 text-lg/[27px] font-medium tracking-[-0.02em]", item.tone === "dark" && "text-gradient-body")}>{item.body}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  </section>
);

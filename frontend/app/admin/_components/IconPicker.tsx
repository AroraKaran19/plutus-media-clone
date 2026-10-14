"use client";

import { cn } from "@/app/utils";
import { CARD_ICONS, type CardIcon } from "@/lib/content/schema";
import { CARD_ICON_COMPONENTS } from "../../(site)/_components/icons";
import { FieldLabel } from "./Field";

type Props = {
  label: string;
  value: CardIcon;
  labels: Record<CardIcon, string>;
  onChange: (value: CardIcon) => void;
};

// Dark tiles so every icon renders as it does on the site, including the light gradient one.
export const IconPicker = ({ label, value, labels, onChange }: Props) => (
  <div>
    <FieldLabel text={label} />
    <div role="radiogroup" aria-label={label} className="mt-1.5 flex flex-wrap gap-2">
      {CARD_ICONS.map((icon) => {
        const Icon = CARD_ICON_COMPONENTS[icon];
        const selected = icon === value;
        return (
          <button
            key={icon}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={labels[icon]}
            title={labels[icon]}
            onClick={() => onChange(icon)}
            className={cn(
              "bg-ink text-frost grid size-12 place-items-center rounded-xl transition-[box-shadow,opacity] duration-200",
              selected ? "opacity-100 ring-2 ring-[#7479ff] ring-offset-2" : "opacity-55 hover:opacity-100"
            )}
          >
            <Icon className="size-6" />
          </button>
        );
      })}
    </div>
  </div>
);

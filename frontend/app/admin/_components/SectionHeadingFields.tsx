"use client";

import { Field } from "./Field";

type Props = {
  pill: string;
  title: string;
  onPill: (pill: string) => void;
  onTitle: (title: string) => void;
};

export const SectionHeadingFields = ({ pill, title, onPill, onTitle }: Props) => (
  <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
    <Field label="Badge" value={pill} onChange={onPill} hint="The small pill above the heading. Leave blank to hide." />
    <Field label="Heading" required value={title} onChange={onTitle} />
  </div>
);

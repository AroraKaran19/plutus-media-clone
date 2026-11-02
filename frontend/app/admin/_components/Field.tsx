"use client";

import type { LinkItem } from "@/lib/content/schema";

export const inputClasses =
  "mt-1.5 w-full rounded-xl border border-[#e3e5f0] bg-white px-3.5 py-2.5 text-[15px] text-ink shadow-[inset_0_1px_2px_rgb(3_5_28/0.04)] outline-none transition-colors placeholder:text-[#a3a8bd] focus:border-[#7479ff] focus:ring-4 focus:ring-[#7479ff]/15";

export const FieldLabel = ({ text, required }: { text: string; required?: boolean }) => (
  <span className="text-ink text-sm font-semibold">
    {text}
    {required && (
      <span className="ml-0.5 text-[#ff6c69]" aria-hidden>
        *
      </span>
    )}
    {required && <span className="sr-only"> (required)</span>}
  </span>
);

const Hint = ({ text }: { text?: string }) => (text ? <span className="mt-1.5 block text-xs text-[#6b7189]">{text}</span> : null);

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "password" | "url";
  hint?: string;
  required?: boolean;
  autoComplete?: string;
};

export const Field = ({ label, value, onChange, placeholder, type = "text", hint, required, autoComplete }: FieldProps) => (
  <label className="block">
    <FieldLabel text={label} required={required} />
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      onChange={(e) => onChange(e.target.value)}
      className={inputClasses}
    />
    <Hint text={hint} />
  </label>
);

type TextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
  required?: boolean;
};

export const TextArea = ({ label, value, onChange, rows = 4, hint, required }: TextAreaProps) => (
  <label className="block">
    <FieldLabel text={label} required={required} />
    <textarea value={value} rows={rows} required={required} onChange={(e) => onChange(e.target.value)} className={inputClasses} />
    <Hint text={hint} />
  </label>
);

type SelectProps<T extends string> = {
  label: string;
  value: T;
  options: readonly T[];
  labels?: Record<T, string>;
  onChange: (value: T) => void;
  hint?: string;
};

export const Select = <T extends string>({ label, value, options, labels, onChange, hint }: SelectProps<T>) => (
  <label className="block">
    <FieldLabel text={label} />
    <select value={value} onChange={(e) => onChange(e.target.value as T)} className={inputClasses}>
      {options.map((option) => (
        <option key={option} value={option}>
          {labels?.[option] ?? option}
        </option>
      ))}
    </select>
    <Hint text={hint} />
  </label>
);

export const LinkFields = ({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: LinkItem;
  onChange: (value: LinkItem) => void;
  hint?: string;
}) => (
  <div className="grid gap-4 sm:grid-cols-2">
    <Field label={`${label} text`} required value={value.label} onChange={(text) => onChange({ ...value, label: text })} />
    <Field label={`${label} link`} required value={value.href} onChange={(href) => onChange({ ...value, href })} hint={hint} />
  </div>
);

export const VIDEO_LINK_HINT =
  "Any link works. YouTube, Vimeo, Wistia, Loom and direct video files (.mp4) play on the page; other links open in a new tab.";

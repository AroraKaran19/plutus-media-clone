"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

type ArrayFieldProps<T> = {
  label: string;
  items: T[];
  // An updater, so an edit landing while an upload is in flight is not overwritten.
  onChange: (update: (prev: T[]) => T[]) => void;
  create: () => T;
  renderItem: (item: T, update: (next: T | ((prev: T) => T)) => void, index: number) => ReactNode;
  itemLabel?: (item: T, index: number) => string;
  max?: number;
  addLabel?: string;
  hint?: string;
};

const iconButton =
  "grid size-8 place-items-center rounded-full text-[#6b7189] transition-colors hover:bg-[#eef0f8] hover:text-ink disabled:pointer-events-none disabled:opacity-30";

export const ArrayField = <T,>({ label, items, onChange, create, renderItem, itemLabel, max, addLabel = "Add", hint }: ArrayFieldProps<T>) => {
  const move = (from: number, to: number) =>
    onChange((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });

  const update = (index: number, value: T | ((prev: T) => T)) =>
    onChange((prev) => {
      const next = [...prev];
      next[index] = typeof value === "function" ? (value as (prev: T) => T)(prev[index]) : value;
      return next;
    });

  const remove = (index: number) => onChange((prev) => prev.filter((_, i) => i !== index));

  const atMax = max !== undefined && items.length >= max;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-ink text-sm font-semibold">{label}</span>
        <span className="rounded-full bg-[#eef0f8] px-2.5 py-0.5 text-xs font-semibold text-[#5b6178]">
          {items.length}
          {max !== undefined && ` / ${max}`}
        </span>
      </div>
      {hint && <p className="mt-1 text-xs text-[#6b7189]">{hint}</p>}

      <ol className="mt-3 flex flex-col gap-3">
        {items.map((item, index) => (
          <li key={index} className="rounded-2xl border border-[#e3e5f0] bg-[#fafbfe] p-4">
            <div className="mb-3 flex items-center gap-1">
              <span className="text-ink mr-auto truncate text-sm font-semibold">
                <span className="text-[#a3a8bd]">{String(index + 1).padStart(2, "0")}</span>
                {itemLabel && <span className="ml-2">{itemLabel(item, index)}</span>}
              </span>
              <button type="button" onClick={() => move(index, index - 1)} disabled={index === 0} aria-label={`Move ${label} item ${index + 1} up`} className={iconButton}>
                <ArrowUp className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => move(index, index + 1)}
                disabled={index === items.length - 1}
                aria-label={`Move ${label} item ${index + 1} down`}
                className={iconButton}
              >
                <ArrowDown className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={`Remove ${label} item ${index + 1}`}
                className="grid size-8 place-items-center rounded-full text-[#e5484d] transition-colors hover:bg-[#fdecec]"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <div className="flex flex-col gap-4">{renderItem(item, (next) => update(index, next), index)}</div>
          </li>
        ))}
      </ol>

      {!atMax && (
        <button
          type="button"
          onClick={() => onChange((prev) => [...prev, create()])}
          className="text-ink mt-3 inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#c9cde0] px-4 py-2 text-sm font-semibold transition-colors hover:border-[#7479ff] hover:text-[#5a5fe0]"
        >
          <Plus className="size-4" />
          {addLabel}
        </button>
      )}
    </div>
  );
};

"use client";

import { Check, ExternalLink, LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";
import { useContentArea, type DraftUpdate } from "@/lib/admin/hooks/useContentArea";
import type { SiteContent } from "@/lib/content/schema";
import { Button } from "./Button";
import { ErrorPanel } from "./ErrorPanel";

type Props<T> = {
  title: string;
  description: string;
  area: string;
  select: (content: SiteContent) => T;
  previewHash?: string;
  children: (draft: T, setDraft: (next: DraftUpdate<T>) => void) => ReactNode;
};

export const PageHeader = ({ title, description, previewHash }: { title: string; description: string; previewHash?: string }) => (
  <header className="flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 className="font-display text-ink text-3xl font-semibold tracking-[-0.02em]">{title}</h1>
      <p className="mt-1.5 text-[15px] text-[#5b6178]">{description}</p>
    </div>
    {previewHash !== undefined && (
      <a
        href={`/${previewHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5a5fe0] hover:underline"
      >
        View on site
        <ExternalLink className="size-3.5" />
      </a>
    )}
  </header>
);

export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <section
    className={`rounded-3xl border border-[#e8eaf3] bg-white p-6 shadow-[0_1px_2px_rgb(3_5_28/0.05),0_18px_40px_-24px_rgb(3_5_28/0.25)] sm:p-8 ${className}`}
  >
    {children}
  </section>
);

export const EditorShell = <T,>({ title, description, area, select, previewHash = "", children }: Props<T>) => {
  const { draft, update, save, status, isDirty, loadError } = useContentArea(area, select);

  if (loadError) {
    return (
      <div className="max-w-3xl">
        <PageHeader title={title} description={description} />
        <div className="mt-8">
          <ErrorPanel message={`Could not load content: ${loadError}`} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl pb-28">
      <PageHeader title={title} description={description} previewHash={previewHash} />

      <Card className="mt-8">
        {draft === null ? (
          <div className="flex flex-col gap-5" aria-busy="true" aria-label="Loading">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-[#f0f2f8]" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6">{children(draft, update)}</div>
        )}
      </Card>

      {status.kind === "error" && (
        <div className="mt-6">
          <ErrorPanel message={status.message} issues={status.issues} />
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#e8eaf3] bg-white/85 backdrop-blur-md md:left-64">
        <div className="flex max-w-3xl items-center justify-end gap-4 px-6 py-4 sm:px-10">
          <span role="status" className="mr-auto text-sm">
            {status.kind === "saved" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e7f8ef] px-3 py-1 font-semibold text-[#17803d]">
                <Check className="size-4" />
                Saved. The live site is updating.
              </span>
            )}
            {isDirty && status.kind === "idle" && <span className="font-medium text-[#b26b00]">Unsaved changes</span>}
          </span>
          <Button onClick={save} disabled={draft === null || status.kind === "saving" || !isDirty}>
            {status.kind === "saving" && <LoaderCircle className="size-4 animate-spin" />}
            {status.kind === "saving" ? "Saving" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

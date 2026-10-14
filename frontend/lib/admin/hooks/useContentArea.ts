"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, getContent, patchArea, type FieldIssue } from "@/lib/admin/api";
import type { SiteContent } from "@/lib/content/schema";

export type SaveStatus =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "error"; message: string; issues: FieldIssue[] };

export type DraftUpdate<T> = T | ((prev: T) => T);

export const toErrorStatus = (error: unknown, fallback: string): SaveStatus => ({
  kind: "error",
  message: error instanceof Error ? error.message : fallback,
  issues: error instanceof ApiError ? error.fieldIssues : [],
});

export const useContentArea = <T>(area: string, select: (content: SiteContent) => T) => {
  const [draft, setDraft] = useState<T | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [status, setStatus] = useState<SaveStatus>({ kind: "idle" });

  useEffect(() => {
    let cancelled = false;

    getContent()
      .then((content) => {
        if (cancelled) return;
        const slice = select(content);
        setDraft(slice);
        setSaved(JSON.stringify(slice));
      })
      .catch((error: Error) => {
        if (!cancelled) setLoadError(error.message);
      });

    return () => {
      cancelled = true;
    };
    // `select` is a fresh closure each render; `area` identifies the screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area]);

  // Accepts an updater so two async edits (say, two uploads) cannot overwrite each other.
  const update = useCallback((next: DraftUpdate<T>) => {
    setDraft((prev) => {
      if (typeof next !== "function") return next;
      return prev === null ? prev : (next as (prev: T) => T)(prev);
    });
    setStatus({ kind: "idle" });
  }, []);

  const save = useCallback(async () => {
    if (draft === null) return;

    setStatus({ kind: "saving" });
    try {
      await patchArea(area, draft);
      setSaved(JSON.stringify(draft));
      setStatus({ kind: "saved" });
    } catch (error) {
      setStatus(toErrorStatus(error, "Could not save"));
    }
  }, [area, draft]);

  const isDirty = draft !== null && JSON.stringify(draft) !== saved;

  return { draft, update, save, status, isDirty, loadError };
};

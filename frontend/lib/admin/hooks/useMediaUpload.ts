"use client";

import { useCallback } from "react";
import { deleteMedia } from "@/lib/admin/api";
import type { Media } from "@/lib/content/schema";

// The shipped defaults back the offline fallback, so they are never deleted on replace.
const isProtected = (publicId: string) =>
  publicId.startsWith(`${process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/site/`);

export const useMediaUpload = (
  value: Media | null,
  onChange: (value: Media | null) => void,
  resourceType: "image" | "video"
) => {
  // Best-effort: an orphan in the media library beats a broken reference on the live site.
  const destroyPrevious = useCallback(
    async (previous: Media | null) => {
      if (!previous || isProtected(previous.publicId)) return;
      try {
        await deleteMedia(previous.publicId, resourceType);
      } catch (error) {
        console.error("[media] Could not delete the replaced asset:", error);
      }
    },
    [resourceType]
  );

  const replace = useCallback(
    async (next: Media) => {
      await destroyPrevious(value);
      onChange(next);
    },
    [destroyPrevious, onChange, value]
  );

  const clear = useCallback(async () => {
    await destroyPrevious(value);
    onChange(null);
  }, [destroyPrevious, onChange, value]);

  return { replace, clear };
};

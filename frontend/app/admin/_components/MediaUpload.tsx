"use client";

import { CloudUpload, Trash2 } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { useMediaUpload } from "@/lib/admin/hooks/useMediaUpload";
import type { Media } from "@/lib/content/schema";
import { FieldLabel } from "./Field";

type Props = {
  label: string;
  value: Media | null;
  onChange: (value: Media | null) => void;
  resourceType?: "image" | "video";
  hint?: string;
  required?: boolean;
};

export const MediaUpload = ({ label, value, onChange, resourceType = "image", hint, required }: Props) => {
  const { replace, clear } = useMediaUpload(value, onChange, resourceType);

  return (
    <div>
      <FieldLabel text={label} required={required} />

      <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-[#e3e5f0] bg-white p-2.5">
        {value ? (
          <>
            {resourceType === "image" ? (
              // Admin previews use the raw upload URL; no optimisation needed here.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value.url} alt="" className="size-14 shrink-0 rounded-lg bg-[#03051c] object-contain" />
            ) : (
              <video src={value.url} className="h-14 w-24 shrink-0 rounded-lg bg-black object-cover" muted />
            )}
            <span className="min-w-0 flex-1 truncate font-mono text-xs text-[#6b7189]">{value.publicId}</span>
            {!required && (
              <button
                type="button"
                onClick={clear}
                aria-label={`Remove ${label}`}
                className="grid size-8 place-items-center rounded-full text-[#e5484d] transition-colors hover:bg-[#fdecec]"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </>
        ) : (
          <span className="flex-1 px-1 text-sm text-[#a3a8bd]">Nothing uploaded</span>
        )}

        <CldUploadWidget
          signatureEndpoint="/api/media/signature"
          options={{ folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER, resourceType, multiple: false, sources: ["local", "url"] }}
          onSuccess={async (result) => {
            const info = result.info;
            if (typeof info === "string" || !info) return;
            await replace({ url: info.secure_url, publicId: info.public_id });
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="text-ink inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#eef0f8] px-3.5 py-2 text-sm font-semibold transition-colors hover:bg-[#e3e6f5]"
            >
              <CloudUpload className="size-4" />
              {value ? "Replace" : "Upload"}
            </button>
          )}
        </CldUploadWidget>
      </div>

      {hint && <span className="mt-1.5 block text-xs text-[#6b7189]">{hint}</span>}
    </div>
  );
};

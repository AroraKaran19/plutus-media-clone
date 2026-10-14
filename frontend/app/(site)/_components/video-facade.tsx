"use client";

import { useState } from "react";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { cn } from "@/app/utils";
import { videoPosterUrl, videoUrl } from "@/app/utils/cloudinary";
import type { VideoSource } from "@/lib/content/schema";
import { resolveVideo } from "@/lib/video";
import { YouTubePlay } from "./icons";

type Props = {
  source: VideoSource;
  title: string;
  sizes: string;
  className?: string;
  onPlay?: () => void;
};

export const VideoFacade = ({ source, title, sizes, className, onPlay }: Props) => {
  const [playing, setPlaying] = useState(false);
  const video = resolveVideo(source.link, source.video?.publicId);

  if (playing && video.kind === "embed") {
    return (
      <iframe
        src={video.src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        className={cn("size-full border-0", className)}
      />
    );
  }

  if (playing && (video.kind === "upload" || video.kind === "file")) {
    return (
      <video
        src={video.kind === "upload" ? videoUrl(video.publicId, 1280) : video.src}
        title={title}
        controls
        autoPlay
        playsInline
        className={cn("size-full bg-black object-contain", className)}
      />
    );
  }

  const fallbackPoster =
    video.kind === "embed" ? video.thumbnail : video.kind === "upload" ? videoPosterUrl(video.publicId, 1280) : undefined;

  const poster = (
    <>
      {source.thumbnail ? (
        <CldImage src={source.thumbnail.publicId} alt="" fill sizes={sizes} className="object-cover" />
      ) : (
        fallbackPoster && <Image src={fallbackPoster} alt="" fill unoptimized className="object-cover" />
      )}
      <YouTubePlay className="absolute top-1/2 left-1/2 h-12 w-[68px] -translate-x-1/2 -translate-y-1/2" />
    </>
  );

  const frame = cn("group relative block size-full overflow-hidden bg-black", className);

  if (video.kind === "external") {
    return (
      <a href={video.href} target="_blank" rel="noopener noreferrer" aria-label={`Watch video: ${title} (opens in a new tab)`} className={frame}>
        {poster}
      </a>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Play video: ${title}`}
      onClick={() => {
        setPlaying(true);
        onPlay?.();
      }}
      className={frame}
    >
      {poster}
    </button>
  );
};

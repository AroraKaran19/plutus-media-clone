"use client";

import { useEffect, useRef } from "react";
import { videoPosterUrl, videoUrl } from "@/app/utils/cloudinary";

export const HeroVideo = ({ publicId, label }: { publicId: string; label: string }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduced) video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "200px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={videoUrl(publicId, 566)}
      poster={videoPosterUrl(publicId, 566)}
      aria-label={`${label} UGC video`}
      muted
      loop
      playsInline
      preload="none"
      className="size-full object-cover"
    />
  );
};

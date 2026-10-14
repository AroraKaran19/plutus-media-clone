export type PlayableVideo =
  | { kind: "upload"; publicId: string }
  | { kind: "file"; src: string }
  | { kind: "embed"; src: string; thumbnail?: string }
  | { kind: "external"; href: string };

const youTubeId = (link: string) =>
  /^[\w-]{11}$/.test(link) ? link : link.match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/)([\w-]{11})/)?.[1];

// Uploads and known providers play in place; any other link opens in a new tab.
export const resolveVideo = (link: string, uploadPublicId?: string): PlayableVideo => {
  if (uploadPublicId) return { kind: "upload", publicId: uploadPublicId };

  const yt = youTubeId(link);
  if (yt) {
    return {
      kind: "embed",
      src: `https://www.youtube.com/embed/${yt}?autoplay=1&iv_load_policy=3&rel=0&modestbranding=1&playsinline=1`,
      thumbnail: `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`,
    };
  }

  const vimeo = link.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];
  if (vimeo) return { kind: "embed", src: `https://player.vimeo.com/video/${vimeo}?autoplay=1` };

  const loom = link.match(/loom\.com\/(?:share|embed)\/([\w]+)/)?.[1];
  if (loom) return { kind: "embed", src: `https://www.loom.com/embed/${loom}?autoplay=1` };

  if (/\.(mp4|webm|mov|ogg|m4v)(\?|#|$)/i.test(link)) return { kind: "file", src: link };

  return { kind: "external", href: link };
};

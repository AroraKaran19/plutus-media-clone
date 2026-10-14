import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";

// Fixed design assets that are part of the layout, not editable content.
export const assetId = (path: string) => `${process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/site/${path}`;

export const imageUrl = (publicId: string, width?: number) =>
  getCldImageUrl({ src: publicId, width, format: "auto", quality: "auto" });

export const videoUrl = (publicId: string, width: number) =>
  getCldVideoUrl({ src: publicId, width, format: "mp4", quality: "auto" });

export const videoPosterUrl = (publicId: string, width: number) =>
  getCldVideoUrl({ src: publicId, width, format: "jpg", quality: "auto", rawTransformations: ["so_0"] });

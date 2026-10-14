import { revalidateTag } from "next/cache";
import { CONTENT_CACHE_TAG } from "@/lib/content/get";

// Not under /api: next.config rewrites every /api path to the Express backend.
export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret");

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: "Invalid secret" }, { status: 401 });
  }

  // "max" serves the stale page instantly while the fresh content loads in the background.
  revalidateTag(CONTENT_CACHE_TAG, "max");

  return Response.json({ revalidated: true, tag: CONTENT_CACHE_TAG });
}

import { env } from "../config/env";

// Fire-and-forget: the write already persisted, so a failed cache bust must not fail the request.
export const triggerRevalidate = async (): Promise<void> => {
  if (!env.FRONTEND_REVALIDATE_URL || !env.REVALIDATE_SECRET) {
    console.warn("⚠️  Revalidation not configured, skipping cache bust");
    return;
  }

  try {
    const res = await fetch(env.FRONTEND_REVALIDATE_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-revalidate-secret": env.REVALIDATE_SECRET },
    });
    if (!res.ok) console.error(`⚠️  Revalidation failed: ${res.status}`);
  } catch (error) {
    console.error("⚠️  Revalidation request threw:", error);
  }
};

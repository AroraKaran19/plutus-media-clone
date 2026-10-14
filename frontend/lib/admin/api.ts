import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { deepMerge } from "@/lib/content/merge";
import type { SiteContent } from "@/lib/content/schema";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
}

export interface FieldIssue {
  path: string;
  label: string;
  message: string;
}

// Carries the backend's per-field failures so a form can list every bad field.
export class ApiError extends Error {
  readonly fieldIssues: FieldIssue[];
  readonly status: number;

  constructor(message: string, status: number, fieldIssues: FieldIssue[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldIssues = fieldIssues;
  }
}

// Same-origin: next.config rewrites /api to Express, so the httpOnly cookie rides along.
const adminFetch = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...init?.headers },
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(body?.error?.message ?? `Request failed (${res.status})`, res.status, body?.error?.fieldIssues ?? []);
  }

  return body.data as T;
};

export const login = (email: string, password: string) =>
  adminFetch<AdminUser>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });

export const logout = () => adminFetch<null>("/auth/logout", { method: "POST" });

export const getMe = () => adminFetch<AdminUser>("/auth/me");

export const updateProfile = (patch: { name?: string; email?: string }) =>
  adminFetch<AdminUser>("/account", { method: "PATCH", body: JSON.stringify(patch) });

export const changePassword = (currentPassword: string, newPassword: string) =>
  adminFetch<null>("/account/password", { method: "PATCH", body: JSON.stringify({ currentPassword, newPassword }) });

// Merged over the defaults so a field added after seeding never reaches an editor as undefined.
export const getContent = async () => deepMerge(DEFAULT_CONTENT, await adminFetch<SiteContent>("/content"));

export const patchArea = <T>(area: string, data: T) =>
  adminFetch<SiteContent>(`/content/${area}`, { method: "PATCH", body: JSON.stringify(data) });

export const deleteMedia = (publicId: string, resourceType: "image" | "video") =>
  adminFetch<unknown>("/media", { method: "DELETE", body: JSON.stringify({ publicId, resourceType }) });

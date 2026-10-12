import { ZodError, ZodIssue } from "zod";

export interface FieldIssue {
  path: string;
  label: string;
  message: string;
}

const humanizeKey = (key: string) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());

// ["logos", 1, "url"] becomes "Logo 2 → Url": indexes are 1-based, as editors see them.
const humanizePath = (path: PropertyKey[]): string => {
  const parts: string[] = [];

  for (const segment of path) {
    if (typeof segment === "number") {
      // Singularize the container this index belongs to: "Logos" → "Logo 2".
      const container = parts.pop() ?? "Item";
      parts.push(`${container.replace(/s$/, "")} ${segment + 1}`);
      continue;
    }
    parts.push(humanizeKey(String(segment)));
  }

  return parts.join(" → ") || "This field";
};

/** Zod's own wording is written for developers; rewrite the common cases. */
const humanizeMessage = (issue: ZodIssue): string => {
  if (issue.code === "too_small" && issue.origin === "string") {
    return "Cannot be empty";
  }
  if (issue.code === "too_big" && issue.origin === "array") {
    return `At most ${issue.maximum} allowed`;
  }
  if (issue.code === "invalid_format" && issue.format === "url") {
    return "Must be a valid URL. Upload a file or paste a full https:// link";
  }
  if (issue.code === "invalid_format" && issue.format === "email") {
    return "Must be a valid email address";
  }
  if (issue.code === "invalid_type") {
    return "Is required";
  }
  return issue.message;
};

export const formatZodError = (error: ZodError) => {
  const issues: FieldIssue[] = error.issues.map((issue) => ({
    path: issue.path.join("."),
    label: humanizePath(issue.path as PropertyKey[]),
    message: humanizeMessage(issue),
  }));

  const count = issues.length;
  const message =
    count === 1
      ? `${issues[0].label}: ${issues[0].message}`
      : `${count} fields need attention`;

  return { message, issues };
};

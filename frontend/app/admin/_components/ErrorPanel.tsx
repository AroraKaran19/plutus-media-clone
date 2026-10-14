"use client";

import { CircleAlert } from "lucide-react";
import type { FieldIssue } from "@/lib/admin/api";

export const ErrorPanel = ({ message, issues = [] }: { message: string; issues?: FieldIssue[] }) => (
  <div role="alert" className="rounded-2xl border border-[#f6c9c9] bg-[#fff5f5] p-4 text-[#9b1c1f]">
    <p className="flex items-center gap-2 text-sm font-semibold">
      <CircleAlert className="size-4 shrink-0" aria-hidden />
      {message}
    </p>

    {issues.length > 0 && (
      <ul className="mt-3 flex flex-col gap-1.5 pl-6">
        {issues.map((issue) => (
          <li key={issue.path} className="list-disc text-sm">
            <span className="font-semibold">{issue.label}</span>
            <span className="text-[#b4383b]">: {issue.message}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

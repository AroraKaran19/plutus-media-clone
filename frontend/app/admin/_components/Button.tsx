import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/app/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "quiet" };

export const Button = ({ variant = "primary", className, type = "button", ...props }: Props) => (
  <button
    type={type}
    {...props}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-[transform,box-shadow,opacity] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7479ff] disabled:cursor-not-allowed disabled:opacity-50",
      variant === "primary"
        ? "text-ink h-11 bg-[linear-gradient(100deg,#fabdbd_0%,#ff8e8c_50%,#7479ff_100%)] px-6 shadow-[0_8px_24px_-10px_rgb(255_108_105/0.8)] hover:-translate-y-px hover:shadow-[0_12px_28px_-10px_rgb(255_108_105/0.9)] active:translate-y-0"
        : "h-9 px-3 text-[#5b6178] hover:text-ink",
      className
    )}
  />
);

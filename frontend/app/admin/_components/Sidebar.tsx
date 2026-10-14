"use client";

import { ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/app/utils";
import { logout } from "@/lib/admin/api";

const GROUPS = [
  {
    label: "Site",
    links: [
      { href: "/admin/seo", label: "SEO" },
      { href: "/admin/navbar", label: "Navigation" },
      { href: "/admin/footer", label: "Footer" },
    ],
  },
  {
    label: "Homepage",
    links: [
      { href: "/admin/hero", label: "Hero" },
      { href: "/admin/clients", label: "Client logos" },
      { href: "/admin/about", label: "About video" },
      { href: "/admin/case-studies", label: "Case studies" },
      { href: "/admin/testimonials", label: "Testimonials" },
      { href: "/admin/benefits", label: "Benefits" },
      { href: "/admin/blog", label: "Blog teaser" },
      { href: "/admin/faq", label: "FAQ" },
      { href: "/admin/cta", label: "Call to action" },
    ],
  },
  { label: "You", links: [{ href: "/admin/account", label: "Account" }] },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    await logout().catch(() => null);
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="bg-ink relative z-30 flex shrink-0 flex-col overflow-hidden text-white md:fixed md:inset-y-0 md:left-0 md:w-64">

      <div className="relative flex items-center justify-between px-5 pt-5 md:block md:px-6 md:pt-7">
        <Link href="/admin/hero" className="font-display text-lg font-semibold tracking-[-0.02em] text-white">
          Admin
        </Link>
        <p className="text-frost/60 hidden text-xs md:mt-2 md:block">Content dashboard</p>
        <button
          type="button"
          onClick={signOut}
          aria-label="Sign out"
          className="text-frost/70 grid size-9 place-items-center rounded-full hover:bg-white/10 hover:text-[#ff8e8c] md:hidden"
        >
          <LogOut className="size-4" />
        </button>
      </div>

      <nav aria-label="Admin" className="relative mt-4 flex gap-1 overflow-x-auto px-3 pb-3 md:mt-8 md:flex-1 md:flex-col md:gap-6 md:overflow-y-auto md:px-4">
        {GROUPS.map((group) => (
          <div key={group.label} className="flex shrink-0 gap-1 md:flex-col">
            <p className="text-frost/45 hidden px-3 pb-1 text-xs font-medium md:block">{group.label}</p>
            {group.links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                    active ? "bg-white/12 text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)]" : "text-frost/70 hover:bg-white/6 hover:text-white"
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "size-1.5 rounded-full transition-colors",
                      active ? "bg-[linear-gradient(135deg,#ff8e8c,#7479ff)]" : "bg-white/15"
                    )}
                  />
                  {link.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="relative hidden flex-col gap-1 border-t border-white/10 p-4 md:flex">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-frost/70 flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium hover:bg-white/6 hover:text-white"
        >
          <ExternalLink className="size-4" />
          View live site
        </a>
        <button
          type="button"
          onClick={signOut}
          className="text-frost/70 flex items-center gap-2 rounded-full px-3 py-2 text-left text-sm font-medium hover:bg-white/6 hover:text-[#ff8e8c]"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
};

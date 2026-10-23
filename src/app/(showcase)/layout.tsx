import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";

import { GlassToolbar } from "./glass-toolbar";

import { MobileNav } from "./mobile-nav";
import { ComponentsNav } from "./nav";

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      {/* Glass toolbar — Figma: iOS "Toolbars" / macOS "Windows" */}
      <GlassToolbar className="sticky top-0 z-40 rounded-none border-0 shadow-[0_0.5px_0_var(--glass-hairline)]">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-4 px-5">
          <Link href="/" className="text-[15px] font-semibold tracking-tight">
            Apple Liquid
          </Link>
          <span className="hidden rounded-full bg-fill-tertiary px-2 py-0.5 text-[11px] text-label-secondary sm:inline">
            Apple OS 27 · shadcn
          </span>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <MobileNav />
          </div>
        </div>
      </GlassToolbar>

      <div className="mx-auto flex max-w-[1400px] gap-10 px-5">
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-56 shrink-0 overflow-y-auto py-8 lg:block">
          <ComponentsNav />
        </aside>
        <main className="min-w-0 flex-1 py-8">{children}</main>
      </div>
    </div>
  );
}

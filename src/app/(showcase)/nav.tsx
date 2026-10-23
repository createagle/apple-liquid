"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { motion } from "motion/react"
import { cn } from "cn"

import { SECTION_GROUPS, ALL_SECTIONS } from "./sections"

/** Sidebar nav that tracks which section is on screen, shadcn-docs style. */
function ComponentsNav({ onNavigate }: { onNavigate?: () => void }) {
  const [active, setActive] = React.useState(ALL_SECTIONS[0]?.id ?? "")
  // Both the desktop sidebar and the mobile drawer can be mounted at the same
  // time, so each needs its own layoutId or Motion animates between them.
  const layoutId = React.useId()

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 }
    )

    for (const section of ALL_SECTIONS) {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="flex flex-col gap-6 text-[13px]">
      {SECTION_GROUPS.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          <p className="px-3 pb-1 text-[11px] font-semibold tracking-wide text-label-tertiary uppercase">
            {group.label}
          </p>
          {group.items.map((item) => {
            const isActive = active === item.id
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={onNavigate}
                className={cn(
                  "relative flex items-center justify-between rounded-[10px] px-3 py-1.5 transition-colors duration-200",
                  isActive
                    ? "text-white"
                    : "text-label-secondary hover:bg-fill-tertiary hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId={layoutId}
                    className="absolute inset-0 rounded-[10px] bg-primary"
                    transition={{ type: "spring", stiffness: 480, damping: 40 }}
                  />
                )}
                <span className="relative z-10">{item.title}</span>
                {isActive && (
                  <CheckIcon className="relative z-10 size-4 shrink-0" />
                )}
              </a>
            )
          })}
        </div>
      ))}
    </nav>
  )
}

export { ComponentsNav }

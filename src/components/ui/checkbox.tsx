"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { motion } from "motion/react"
import { cn } from "cn"


/**
 * Apple OS 27 checkbox — Figma: macOS "Toggles - Checkboxes" (`497:3757`).
 * Variants in the kit are Active x State x Selection(Off/Mixed/On); the checked
 * fill is Accents/Blue and the glyph comes from `_Glyphs - Checkboxes`.
 * The glyph is redrawn here as a stroked path so Motion can animate the draw.
 */
function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-[18px] shrink-0 items-center justify-center rounded-[5px] outline-none",
        "bg-card shadow-[inset_0_0_0_0.5px_var(--separator)]",
        "transition-[background-color,box-shadow] duration-200 ease-apple",
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        "focus-visible:ring-[3px] focus-visible:ring-ring/45",
        "disabled:cursor-not-allowed disabled:opacity-40 group-has-disabled/field:opacity-40",
        "aria-invalid:shadow-[inset_0_0_0_1px_var(--destructive)]",
        "data-checked:bg-primary data-checked:shadow-none",
        "data-indeterminate:bg-primary data-indeterminate:shadow-none",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        keepMounted
        render={(indicatorProps, state) => (
          <span {...indicatorProps} className="grid place-content-center">
            <svg
              viewBox="0 0 18 18"
              className="size-[18px]"
              fill="none"
              stroke="var(--primary-foreground)"
              strokeWidth={2.1}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                d={state.indeterminate ? "M4.6 9 H13.4" : "M4.4 9.3 L7.5 12.3 L13.6 5.9"}
                initial={false}
                animate={{
                  pathLength: state.checked || state.indeterminate ? 1 : 0,
                  opacity: state.checked || state.indeterminate ? 1 : 0,
                }}
                transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
              />
            </svg>
          </span>
        )}
      />
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }

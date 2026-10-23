"use client"

import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { motion } from "motion/react"
import { cn } from "cn"

import { motionSafe } from "@/lib/motion"

/** Apple OS 27 radio — Figma: macOS "Toggles - Radio Buttons" (`121:12141`). */
function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-2.5", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-[18px] shrink-0 items-center justify-center rounded-full outline-none",
        "bg-card shadow-[inset_0_0_0_0.5px_var(--separator)]",
        "transition-[background-color,box-shadow] duration-200 ease-apple",
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        "focus-visible:ring-[3px] focus-visible:ring-ring/45",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "aria-invalid:shadow-[inset_0_0_0_1px_var(--destructive)]",
        "data-checked:bg-primary data-checked:shadow-none",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        keepMounted
        render={(indicatorProps, state) => (
          <motion.span
            {...motionSafe(indicatorProps)}
            className="block size-[6px] rounded-full bg-primary-foreground"
            initial={false}
            animate={{ scale: state.checked ? 1 : 0, opacity: state.checked ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 640, damping: 30, mass: 0.6 }}
          />
        )}
      />
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }

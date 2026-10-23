"use client"

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/**
 * Apple OS 27 toggle — Figma: macOS "Buttons" (`207:14487`), toolbar variant.
 *
 * The pressed fill used to be `bg-muted`, which resolves to the same
 * #1C1C1E as `--card` in dark mode — the state was invisible on a card.
 * It now uses the fill ramp, which sits above any surface.
 */
const toggleVariants = cva(
  [
    "group/toggle inline-flex items-center justify-center gap-1 rounded-full text-[13px] font-medium whitespace-nowrap",
    "text-foreground transition-[transform,background-color,box-shadow] duration-200 ease-apple outline-none",
    "active:scale-[0.96] active:duration-75",
    "hover:bg-fill-tertiary",
    "focus-visible:ring-[3px] focus-visible:ring-ring/45",
    "disabled:pointer-events-none disabled:opacity-40",
    "aria-invalid:ring-[3px] aria-invalid:ring-destructive/30",
    "aria-pressed:bg-fill-primary data-[state=on]:bg-fill-primary",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "bg-card shadow-[0_0_0_0.5px_var(--glass-hairline)] hover:bg-fill-tertiary",
      },
      size: {
        default:
          "h-[34px] min-w-[34px] px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        sm: "h-7 min-w-7 px-2.5 text-[12px] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-[42px] min-w-[42px] px-4 text-[15px] has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }

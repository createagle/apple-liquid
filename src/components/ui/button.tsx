import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/**
 * Apple OS 27 buttons.
 *
 * Mapped from the Figma kits:
 *   iOS "Button - Liquid Glass - Text/Symbol"  -> variant: glass / glassProminent
 *   iOS "Button - Content Area"                -> variant: default / secondary / ghost
 *   macOS "Buttons"                            -> variant: outline
 *
 * Heights come straight off the kit's Size variants: Small 28, Medium 34,
 * Large 50. Every control is a capsule (`rounded-full`), which is what the
 * kit uses for the whole OS 27 control set.
 */
const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 items-center justify-center rounded-full",
    "font-medium whitespace-nowrap select-none outline-none",
    "transition-[transform,background-color,box-shadow,opacity] duration-200 ease-apple",
    // Apple's press feedback is a compositor-level scale, not a colour change.
    "active:scale-[0.96] active:duration-75",
    "focus-visible:ring-[3px] focus-visible:ring-ring/45",
    "disabled:pointer-events-none disabled:opacity-40",
    "aria-invalid:ring-[3px] aria-invalid:ring-destructive/30",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[1.15em]",
  ].join(" "),
  {
    variants: {
      variant: {
        // "Glass Prominent" — white backing at 94% + accent tint.
        default: "glass-prominent glass-sheen text-primary-foreground",
        // "Glass" — the translucent capsule.
        glass: "glass glass-sheen text-foreground",
        // macOS bordered button.
        outline:
          "bg-card text-foreground shadow-[0_0_0_0.5px_var(--glass-hairline),0_1px_2px_rgba(0,0,0,0.04)] hover:bg-fill-tertiary",
        // iOS "Content Area" tinted button.
        secondary: "bg-fill-secondary text-foreground hover:bg-fill-primary",
        // Borderless.
        ghost: "text-primary hover:bg-fill-tertiary",
        // Same prominent glass, retinted red so the refraction edges follow.
        destructive:
          "glass-prominent glass-sheen text-white [--glass-accent:var(--destructive)]",
        destructiveGhost: "text-destructive hover:bg-destructive/10",
        link: "text-primary underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        // Kit Size=Small
        sm: "h-[28px] gap-1 px-3 text-[13px]",
        // Kit Size=Medium
        default: "h-[34px] gap-1 px-4 text-[15px]",
        // Kit Size=Large
        lg: "h-[48px] gap-1 px-5 text-[17px] leading-[18px]",
        xs: "h-6 gap-1 px-2.5 text-[12px]",
        icon: "size-[34px]",
        "icon-xs": "size-6",
        "icon-sm": "size-[28px]",
        "icon-lg": "size-[48px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

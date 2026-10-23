"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useIntlayer } from "next-intlayer"

import { Button } from "@/components/ui/button"

/**
 * Apple OS 27 text field — Figma: iOS "Text Fields" (`553:22762`) and
 * macOS "Text Fields" (`207:14500`). iOS fields are a filled rounded rect with
 * no stroke; the focus state adds the accent ring rather than a border.
 *
 * Sizes mirror Button's `sm` / `default` / `lg` (kit Small 28, Medium 34,
 * Large 50) height for height, type size for type size, so a field and a
 * button given the same `size` line up in a row or a stacked form.
 *
 * 单行输入框与 Select 一样用全圆角，两侧内边距相应加宽；多行的 Textarea 保持圆角矩形。
 */
const inputVariants = cva(
  [
    "w-full min-w-0 bg-field py-1 text-foreground shadow-[0_0_0_1px_var(--field-border)] outline-none",
    "transition-[background-color,box-shadow] duration-200 ease-apple",
    "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
    "placeholder:text-label-tertiary",
    "focus-visible:ring-[3px] focus-visible:ring-ring/45",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
    "aria-invalid:ring-[3px] aria-invalid:ring-destructive/30",
  ].join(" "),
  {
    variants: {
      size: {
        // Button size=sm
        sm: "h-[26px] rounded-full px-3 text-[13px]",
        // Button size=default
        default: "h-[32px] rounded-full px-3.5 text-[15px]",
        // Button size=lg
        lg: "h-[44px] rounded-full px-5 text-[17px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

type InputSize = NonNullable<VariantProps<typeof inputVariants>["size"]>

/**
 * `size` replaces the native `<input size>` attribute (a character count),
 * which nothing here uses — the field is always `w-full`.
 */
function Input({
  className,
  type,
  size = "default",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-size={size}
      className={cn(inputVariants({ size }), className)}
      {...props}
    />
  )
}

/**
 * The reveal toggle scales with the field: one button size down, inset by the
 * same gap it leaves above and below, and the field's right padding clears it
 * so a long password never runs under the icon.
 */
const PASSWORD_TOGGLE: Record<
  InputSize,
  { button: "icon-xs" | "icon-sm" | "icon"; inset: string; padding: string }
> = {
  sm: { button: "icon-xs", inset: "right-0.5", padding: "pr-7" }, // 28 - 24
  default: { button: "icon-sm", inset: "right-[3px]", padding: "pr-9" }, // 34 - 28
  lg: { button: "icon", inset: "right-2", padding: "pr-12" }, // 50 - 34
}

/** A password field with a show / hide toggle; every other prop goes to Input. */
function PasswordInput({
  className,
  size = "default",
  ...props
}: Omit<React.ComponentProps<typeof Input>, "type">) {
  const [visible, setVisible] = React.useState(false)
  const toggle = PASSWORD_TOGGLE[size ?? "default"]
  const content = useIntlayer("password-input")

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        size={size}
        className={cn(toggle.padding, className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size={toggle.button}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 text-label-secondary",
          toggle.inset
        )}
        aria-label={visible ? content.hide.value : content.show.value}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </Button>
    </div>
  )
}

export { Input, PasswordInput }
export type { InputSize }

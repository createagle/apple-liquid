"use client"

import type { ComponentProps, ReactNode } from "react"
import { cn } from "cn"
import { XIcon } from "lucide-react"
import { useIntlayer } from "next-intlayer"
import { HexColorPicker } from "react-colorful"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input/input"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
const PRESETS = [
  "#0A82FF",
  "#3FD077",
  "#F73735",
  "#F99100",
  "#F4CF29",
  "#AB4BDC",
  "#4BB3CA",
  "#F72A70",
  "#5356CD",
] as const

function normalizeHex(value: string) {
  return (
    value.length === 4
      ? `#${[...value.slice(1)].map((digit) => digit.repeat(2)).join("")}`
      : value
  ).toUpperCase()
}

export interface ColorPickerProps extends Omit<
  ComponentProps<typeof Input>,
  "value" | "defaultValue" | "onChange" | "type"
> {
  value?: string
  onValueChange: (value: string) => void
  /** 字段名，用作颜色面板（移动端底部抽屉）的标题。 */
  label?: ReactNode
}

/** 受控颜色输入；空字符串表示未设置颜色。 */
export function ColorPicker({
  value = "",
  onValueChange,
  className,
  disabled,
  readOnly,
  label,
  placeholder,
  ...props
}: ColorPickerProps) {
  const text = useIntlayer("color-picker")
  const valid = HEX_COLOR.test(value)
  const color = valid ? value : "#94a3b8"
  const locked = disabled || readOnly

  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      <Popover>
        <PopoverTrigger
          disabled={locked}
          aria-label={text.title.value}
          render={
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="shrink-0 p-1.5"
            />
          }
        >
          <span
            className="size-full rounded-full border border-separator/30"
            style={{ backgroundColor: valid ? color : undefined }}
          >
            {!valid && (
              <span className="block h-px w-full translate-y-2 -rotate-45 bg-label-tertiary" />
            )}
          </span>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72 gap-4">
          <PopoverHeader>
            <PopoverTitle>{label ?? text.label}</PopoverTitle>
            <PopoverDescription>{placeholder ?? text.placeholder}</PopoverDescription>
          </PopoverHeader>
          <ColorPickerPanel
            value={value}
            onValueChange={onValueChange}
            disabled={locked}
          />
        </PopoverContent>
      </Popover>
      <Input
        {...props}
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder ?? text.placeholder.value}
        maxLength={7}
        autoComplete="off"
        spellCheck={false}
        className="font-mono"
        onChange={(event) => onValueChange(event.target.value)}
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          disabled={locked}
          className="shrink-0"
          aria-label={text.clear.value}
          onClick={() => onValueChange("")}
        >
          <XIcon />
        </Button>
      )}
    </div>
  )
}

/** Inline variant for editor menus that must retain their selection. */
export function ColorPickerPanel({
  value = "",
  onValueChange,
  disabled,
}: Pick<ColorPickerProps, "value" | "onValueChange" | "disabled">) {
  const text = useIntlayer("color-picker")
  const valid = HEX_COLOR.test(value)
  const color = valid ? value : "#94a3b8"
  return (
    <div className="space-y-3">
      {" "}
      {/* Popover 通过 Portal 渲染，显式禁用以覆盖外部 fieldset 的提交状态。 */}
      {!disabled && (
        <HexColorPicker
          color={color}
          onChange={onValueChange}
          style={{ width: "100%", height: 200 }}
        />
      )}
      <div
        role="group"
        aria-label={text.presets.value}
        className="grid grid-cols-9 gap-1"
      >
        {PRESETS.map((preset) => (
          <Button
            key={preset}
            type="button"
            variant="outline"
            size="icon-xs"
            disabled={disabled}
            aria-label={preset}
            title={preset}
            aria-pressed={valid && normalizeHex(value) === preset}
            className="p-1 aria-pressed:ring-2 aria-pressed:ring-ring"
            onClick={() => onValueChange(preset)}
          >
            <span
              className="size-full rounded-full"
              style={{ backgroundColor: preset }}
            />
          </Button>
        ))}
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { cn } from "cn"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import {
  menuItem,
  menuItemHoverable,
  menuItemIndicated,
  menuItemIndicator,
  menuItemSelected,
} from "@/components/ui/mobile-sheet"

function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({ ...props }: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
  )
}

function CollapsibleContent({
  className,
  ...props
}: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-content"
      className={cn(
        // 展开/收起走高度过渡：Base UI 把面板实际高度放在这个变量里，
        // 进出场那两帧（data-starting/ending-style）压成 0。
        "h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-[280ms] ease-apple",
        "data-starting-style:h-0 data-ending-style:h-0",
        className
      )}
      {...props}
    />
  )
}

type ExpanderRowOption = {
  value: string
  label: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
}

/**
 * 折叠式的单选行：收起时一行显示「标题 + 当前选项」，点一下在原地展开选项列表，
 * 选完自动收起。用在账户菜单这类本身已经是浮层、塞不下也不该再套一层弹层的地方。
 */
function ExpanderRow({
  label,
  value,
  options,
  onValueChange,
  renderValue,
  className,
}: {
  label: React.ReactNode
  value: string
  options: ExpanderRowOption[]
  onValueChange: (value: string, event: React.MouseEvent<HTMLButtonElement>) => void
  /** 收起时右边显示什么，默认是当前项的图标加名字。 */
  renderValue?: (option: ExpanderRowOption) => React.ReactNode
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const current = options.find((item) => item.value === value) ?? options[0]

  if (!current) return null

  const CurrentIcon = current.icon

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className={cn(
        "overflow-hidden rounded-[12px] border border-separator/40 bg-background/40",
        className
      )}
    >
      <CollapsibleTrigger
        type="button"
        className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-[15px] outline-none transition-colors duration-200 ease-apple hover:bg-fill-tertiary focus-visible:ring-[3px] focus-visible:ring-ring/45"
      >
        <span className="font-medium">{label}</span>
        <span className="flex min-w-0 items-center gap-1.5 text-label-secondary">
          {renderValue ? (
            renderValue(current)
          ) : (
            <>
              {CurrentIcon && <CurrentIcon className="size-4 shrink-0" />}
              <span className="truncate">{current.label}</span>
            </>
          )}
          <ChevronDownIcon
            className={cn(
              "size-3.5 shrink-0 text-label-tertiary transition-transform duration-[280ms] ease-apple",
              open && "rotate-180"
            )}
          />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {/* 选项和卡片的边之间留出和弹层一样的 4px。 */}
        <div className="border-t border-separator/40 p-1">
          {options.map((item) => {
            const ItemIcon = item.icon
            const selected = item.value === current.value
            return (
              <button
                key={item.value}
                type="button"
                onClick={(event) => {
                  onValueChange(item.value, event)
                  setOpen(false)
                }}
                data-selected={selected || undefined}
                className={cn(
                  menuItem,
                  menuItemHoverable,
                  menuItemSelected,
                  menuItemIndicated,
                  "w-full"
                )}
              >
                {ItemIcon && (
                  <ItemIcon className="size-4 shrink-0 text-label-secondary" />
                )}
                <span className="flex-1 truncate text-left">{item.label}</span>
                {selected && (
                  <span className={menuItemIndicator}>
                    <CheckIcon />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  ExpanderRow,
  type ExpanderRowOption,
}

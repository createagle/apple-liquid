"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { cn } from "cn"
import { useLiquidGlass } from "@/components/liquid-glass"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"

import {
  menuItem,
  menuItemHighlight,
  menuItemIndicated,
  menuItemIndicator,
  menuItemMultiSelected,
  menuItemSelected,
  mobileSheetBackdrop,
  mobileSheetPopup,
  mobileSheetLabel,
  mobileSheetPositioner,
  MobileSheetHeader,
} from "@/components/ui/mobile-sheet"
import { useIsMobile } from "@/hooks/use-mobile"

const SelectMultipleContext = React.createContext(false)

function Select<Value, Multiple extends boolean | undefined = false>(
  props: SelectPrimitive.Root.Props<Value, Multiple>,
) {
  return (
    <SelectMultipleContext.Provider value={!!props.multiple}>
      <SelectPrimitive.Root {...props} />
    </SelectMultipleContext.Provider>
  )
}

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left", className)}
      {...props}
    />
  )
}

/**
 * 弹出选择按钮的外观（Figma: iOS "Pop-up Buttons" / macOS "Pop-up and
 * Pull-down Buttons"）：灰色填充、全圆角，默认 34px 高，`data-size="sm"` 为 28px。
 * 树选择、图标选择、状态菜单等「点开选一个值」的触发器都用这一份，不另抄样式。
 */
const selectTrigger = [
  "flex w-fit items-center justify-between gap-1.5 rounded-full bg-fill-tertiary py-2 pr-2.5 pl-3.5 text-[15px] whitespace-nowrap outline-none select-none",
  "transition-[background-color,transform,box-shadow] duration-200 ease-apple active:scale-[0.97] active:duration-75",
  "hover:bg-fill-secondary focus-visible:ring-[3px] focus-visible:ring-ring/45",
  "disabled:cursor-not-allowed disabled:opacity-40",
  "aria-invalid:ring-[3px] aria-invalid:ring-destructive/30",
  "data-placeholder:text-label-tertiary",
  "h-[34px] data-[size=sm]:h-7 data-[size=sm]:text-[13px]",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
].join(" ")

/** 触发器右侧的下拉箭头。 */
const selectTriggerIcon = "pointer-events-none size-4 text-label-tertiary"

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        selectTrigger,
        "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon className={selectTriggerIcon} />
        }
      />
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  title,
  description,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: Omit<SelectPrimitive.Popup.Props, "title"> &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  > & {
    /** Centred header, rendered only when the picker becomes a bottom sheet. */
    title?: React.ReactNode
    description?: React.ReactNode
  }) {
  // On phones every picker becomes a bottom sheet (requirement 3).
  const isMobile = useIsMobile()

  // 导航层的浮层：常驻玻璃，折射集中在圆角那一圈（AGENTS.md 第 6 条）。
  const glass = useLiquidGlass<HTMLDivElement>({ material: "pane" })

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Backdrop className={mobileSheetBackdrop} />
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={isMobile ? false : alignItemWithTrigger}
        className={cn("isolate z-50", mobileSheetPositioner)}
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          {...glass.surface}
          data-align-trigger={alignItemWithTrigger}
          className={cn(
            "glass relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-44 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-[14px] p-1 text-popover-foreground duration-150",
            "data-[align-trigger=true]:animate-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1",
            mobileSheetPopup,
            className
          )}
          {...props}
          style={{ ...glass.surface.style, ...props.style }}
        >
          {glass.filter}
          <MobileSheetHeader title={title} description={description} />
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn(mobileSheetLabel, className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  const multiple = React.useContext(SelectMultipleContext)
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        menuItem,
        menuItemHighlight,
        multiple ? menuItemMultiSelected : menuItemSelected,
        menuItemIndicated,
        "data-disabled:pointer-events-none data-disabled:opacity-40",
        "*:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={<span className={cn(menuItemIndicator, multiple && "text-primary")} />}
      >
        <CheckIcon className="pointer-events-none" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-separator/40", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-transparent py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUpIcon
      />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-transparent py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDownIcon
      />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  selectTrigger,
  selectTriggerIcon,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}

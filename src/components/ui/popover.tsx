"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "cn"
import { useLiquidGlass } from "@/components/liquid-glass"

import {
  mobileSheetBackdrop,
  mobileSheetPopup,
  mobileSheetPositioner,
} from "@/components/ui/mobile-sheet"

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  children,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  // 导航层的浮层：常驻玻璃，折射集中在圆角那一圈（AGENTS.md 第 6 条）。
  const glass = useLiquidGlass<HTMLDivElement>({ material: "pane" })

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Backdrop className={mobileSheetBackdrop} />
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className={cn("isolate z-50", mobileSheetPositioner)}
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          {...glass.surface}
          className={cn(
            "glass z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-[16px] p-3.5 text-[15px] text-popover-foreground outline-hidden duration-150",
            // 变成底部抽屉时高度上限 72dvh，内容超出要能滚动。
            "max-md:overflow-y-auto max-md:overscroll-contain",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1",
            mobileSheetPopup,
            className
          )}
          {...props}
          style={{ ...glass.surface.style, ...props.style }}
        >
          {glass.filter}
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-0.5 text-sm max-md:items-center max-md:pb-1 max-md:text-center", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn("font-medium max-md:font-heading max-md:text-base", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn("text-label-secondary max-md:text-[13px]", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}

"use client"

import * as React from "react"
import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card"
import { cn } from "cn"
import { useLiquidGlass } from "@/components/liquid-glass"

import { MobileInfoDialog, useMobileDialog } from "@/components/ui/dialog"

/**
 * 桌面悬浮预览。移动端默认不显示也不拦截触发器的点击（链接照常跳转）；
 * 触发器本身没有操作时传 `mobileTap`，点击打开居中 Dialog。
 */
const HoverCardMobileContext = React.createContext<
  (ReturnType<typeof useMobileDialog> & { tap: boolean }) | null
>(null)

function HoverCard({
  open,
  defaultOpen,
  onOpenChange,
  mobileTap = false,
  ...props
}: PreviewCardPrimitive.Root.Props & {
  /** 移动端点击触发器打开居中 Dialog。触发器是链接或按钮时不要用。 */
  mobileTap?: boolean
}) {
  const press = useMobileDialog({ open, defaultOpen, onOpenChange })
  const tap = press.isMobile && mobileTap

  return (
    <HoverCardMobileContext.Provider value={{ ...press, tap }}>
      <PreviewCardPrimitive.Root
        data-slot="hover-card"
        open={press.isMobile ? false : press.open}
        onOpenChange={press.handleRootOpenChange}
        {...props}
      />
    </HoverCardMobileContext.Provider>
  )
}

function HoverCardTrigger({
  className,
  ...props
}: PreviewCardPrimitive.Trigger.Props) {
  const ctx = React.useContext(HoverCardMobileContext)

  return (
    <PreviewCardPrimitive.Trigger
      data-slot="hover-card-trigger"
      className={cn("max-md:touch-manipulation", className)}
      {...props}
      aria-haspopup={ctx?.tap ? "dialog" : undefined}
      aria-expanded={ctx?.tap ? ctx.open : undefined}
      onClick={(event) => {
        props.onClick?.(event)
        if (ctx?.tap) ctx.openFromTrigger(event)
      }}
    />
  )
}

function HoverCardContent({
  title,
  description,
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 4,
  ...props
}: PreviewCardPrimitive.Popup.Props &
  Pick<
    PreviewCardPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  > & {
    /** Header rendered only in the mobile dialog. */
    title?: React.ReactNode
    description?: React.ReactNode
  }) {
  const mobile = React.useContext(HoverCardMobileContext)

  // 导航层的浮层：常驻玻璃，折射集中在圆角那一圈（AGENTS.md 第 6 条）。
  const glass = useLiquidGlass<HTMLDivElement>({ material: "pane" })

  if (mobile?.isMobile) {
    if (!mobile.tap) return null
    return (
      <MobileInfoDialog
        open={mobile.open}
        onOpenChange={mobile.setOpen}
        triggerRef={mobile.triggerRef}
        title={title}
        description={description}
        className={typeof className === "string" ? className : undefined}
      >
        {children}
      </MobileInfoDialog>
    )
  }

  return (
    <PreviewCardPrimitive.Portal data-slot="hover-card-portal">
      <PreviewCardPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PreviewCardPrimitive.Popup
          data-slot="hover-card-content"
          {...glass.surface}
          className={cn(
            "glass z-50 w-64 origin-(--transform-origin) rounded-[16px] p-3.5 text-[15px] text-popover-foreground outline-hidden duration-150",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1",
            className
          )}
          {...props}
          style={{ ...glass.surface.style, ...props.style }}
        >
          {glass.filter}
          {children}
        </PreviewCardPrimitive.Popup>
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardContent, HoverCardTrigger }

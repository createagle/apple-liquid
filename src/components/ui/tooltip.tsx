"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import { cn } from "cn"
import { useLiquidGlass } from "@/components/liquid-glass"

import { MobileInfoDialog, useMobileDialog } from "@/components/ui/dialog"

/**
 * 桌面悬浮展示。移动端没有悬浮：默认不显示也不拦截触发器的点击（按钮、链接照常
 * 生效）；只有纯展示型触发器（提示图标、溢出文本）传 `mobileTap`，点击打开居中 Dialog。
 */
const TooltipMobileContext = React.createContext<
  (ReturnType<typeof useMobileDialog> & { tap: boolean }) | null
>(null)

function TooltipProvider({
  delay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  )
}

function Tooltip({
  open,
  defaultOpen,
  onOpenChange,
  mobileTap = false,
  ...props
}: TooltipPrimitive.Root.Props & {
  /** 移动端点击触发器打开居中 Dialog。只给本身没有操作的触发器用。 */
  mobileTap?: boolean
}) {
  const press = useMobileDialog({ open, defaultOpen, onOpenChange })
  const tap = press.isMobile && mobileTap && !props.disabled

  return (
    <TooltipMobileContext.Provider value={{ ...press, tap }}>
      <TooltipPrimitive.Root
        data-slot="tooltip"
        open={press.isMobile ? false : press.open}
        onOpenChange={press.handleRootOpenChange}
        {...props}
      />
    </TooltipMobileContext.Provider>
  )
}

function TooltipTrigger({
  className,
  ...props
}: TooltipPrimitive.Trigger.Props) {
  const ctx = React.useContext(TooltipMobileContext)

  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      className={cn("max-md:touch-manipulation", className)}
      {...props}
      aria-haspopup={ctx?.tap ? "dialog" : undefined}
      aria-expanded={ctx?.tap ? ctx.open : undefined}
      onClick={(event) => {
        props.onClick?.(event)
        if (ctx?.tap && !props.disabled) ctx.openFromTrigger(event)
      }}
    />
  )
}

function TooltipContent({
  title,
  description,
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  ...props
  // `title` 挡掉原生那个只收字符串的 title 属性。
}: Omit<TooltipPrimitive.Popup.Props, "title"> &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  > & {
    /** Header rendered only in the mobile dialog. */
    title?: React.ReactNode
    description?: React.ReactNode
  }) {
  const mobile = React.useContext(TooltipMobileContext)

  // 导航层的浮层：常驻玻璃，折射集中在圆角那一圈（AGENTS.md 第 6 条）。
  const glass = useLiquidGlass<HTMLDivElement>({ material: "pane" })
  if (mobile?.isMobile) {
    if (!mobile.tap || props.hidden) return null
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
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          {...glass.surface}
          className={cn(
            "glass z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-[10px] px-2.5 py-1.5 text-[13px] text-foreground",
            "has-data-[slot=kbd]:pr-1.5 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm",
            "data-[state=delayed-open]:animate-in data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1",
            className
          )}
          {...props}
          style={{ ...glass.surface.style, ...props.style }}
        >
          {glass.filter}
          {children}
          <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-[var(--glass-tint)] data-[side=bottom]:top-1 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5 max-md:hidden" />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

type OverflowTooltipProps = Omit<React.ComponentPropsWithoutRef<"span">, "title"> & {
  /** 最多显示的行数，默认单行。 */
  lines?: number
  /**
   * 移动端点击查看完整内容，默认开启。放在链接、按钮里时关闭，
   * 点击照常触发外层的操作，桌面端悬浮仍会显示完整内容。
   */
  mobileTap?: boolean
  tooltipProps?: Omit<React.ComponentProps<typeof TooltipContent>, "children">
}

/** 仅在文本被截断时展示完整内容；支持容器缩放、内容更新及字体加载。 */
function OverflowTooltip({
  children,
  lines = 1,
  mobileTap = true,
  className,
  style,
  tooltipProps,
  ...props
}: OverflowTooltipProps) {
  const textRef = React.useRef<HTMLSpanElement>(null)
  const [isOverflowing, setIsOverflowing] = React.useState(false)
  const lineCount = Number.isFinite(lines) ? Math.max(1, Math.floor(lines)) : 1

  React.useEffect(() => {
    const element = textRef.current
    if (!element) return

    let frame = 0
    let disposed = false
    const measure = () => {
      if (disposed) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        // 单行不换行，只看宽度；多行看高度。clientHeight 会把小数行高（如 15px × 1.35）取整，
        // scrollHeight 却向上取整，差 1px 不算溢出，否则没截断的文字也会弹提示。
        setIsOverflowing(
          element.clientWidth > 0 &&
            (lineCount === 1
              ? element.scrollWidth > element.clientWidth
              : element.scrollHeight - element.clientHeight > 1)
        )
      })
    }

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(element)
    const mutationObserver = new MutationObserver(measure)
    mutationObserver.observe(element, {
      childList: true,
      characterData: true,
      subtree: true,
    })
    void document.fonts.ready.then(measure)
    document.fonts.addEventListener("loadingdone", measure)
    measure()

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      document.fonts.removeEventListener("loadingdone", measure)
    }
    // 切换普通文本 / Tooltip 时 span 会重新挂载，需要重新绑定观察器。
  }, [children, lineCount, isOverflowing])

  const text = (
    <span
      {...props}
      ref={textRef}
      data-slot="overflow-tooltip-text"
      className={cn("min-w-0 max-w-full", className)}
      style={{
        ...style,
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: lineCount === 1 ? "block" : "-webkit-box",
        whiteSpace: lineCount === 1 ? "nowrap" : "normal",
        overflowWrap: "anywhere",
        WebkitBoxOrient: lineCount === 1 ? undefined : "vertical",
        WebkitLineClamp: lineCount === 1 ? undefined : lineCount,
      }}
    >
      {children}
    </span>
  )

  if (!isOverflowing) return text

  return (
    <Tooltip mobileTap={mobileTap}>
      <TooltipTrigger render={text} tabIndex={props.tabIndex ?? (mobileTap ? 0 : -1)} />
      <TooltipContent
        {...tooltipProps}
        className={cn("whitespace-pre-wrap [overflow-wrap:anywhere]", tooltipProps?.className)}
      >
        {children}
      </TooltipContent>
    </Tooltip>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, OverflowTooltip }
export type { OverflowTooltipProps }

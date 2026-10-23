"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { useLiquidGlass } from "@/components/liquid-glass"

/**
 * Apple OS 27 segmented control — Figma: iOS "Segmented Controls"
 * (`507:24683`) and macOS "Segmented Controls" (`207:14492`).
 *
 * The selected segment is a glass capsule that slides between positions.
 * It is Base UI's `Tabs.Indicator`, positioned from CSS vars measured relative
 * to the list — not a viewport-measured shared-layout animation, which arcs
 * when the list itself moves (e.g. inside a centred dialog that resizes).
 *
 * 胶囊静止时就是一块实心的卡片色；按下的那一刻取用液态玻璃，边缘把底下的轨道和
 * 页面掰弯，松手后一直保持到它滑到位才变回实心 —— Apple HIG 把分段控件算在内容层，
 * 这类控件只在交互的瞬间取用玻璃（见 globals.css 里 data-trigger 的说明）。
 */

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn("group/tabs flex gap-3 data-horizontal:flex-col", className)}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list relative inline-flex w-fit items-center justify-center p-[2px] text-label-secondary group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
  {
    variants: {
      variant: {
        // iOS capsule segmented control. 胶囊可以拖，所以横向手势归自己处理。
        default:
          "touch-pan-y rounded-full bg-fill-tertiary select-none group-data-horizontal/tabs:h-[34px]",
        // Underlined tabs (macOS toolbar style).
        line: "gap-1 rounded-none bg-transparent",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

/** 胶囊滑到位要这么久；和下面 className 里的 duration 必须一致。 */
const INDICATOR_SLIDE_MS = 350

/** 列表的内边距（p-[2px]）：拖动时胶囊夹在这之间，不会探到轨道外面。 */
const LIST_PADDING = 2

const TRIGGER = '[data-slot="tabs-trigger"]'

const isSelected = (tab: Element) => tab.getAttribute("aria-selected") === "true"

function TabsList({
  className,
  variant = "default",
  children,
  onPointerDown,
  onKeyDown,
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  const [lifted, setLifted] = React.useState(false)
  const indicatorRef = React.useRef<HTMLSpanElement | null>(null)
  const drag = React.useRef<{
    pointerId: number
    grab: number
    moved: boolean
  } | null>(null)
  const dragged = React.useRef(false)
  const glass = useLiquidGlass<HTMLSpanElement>({
    trigger: "active",
    active: lifted,
    className:
      "absolute top-(--active-tab-top) left-(--active-tab-left) z-10 h-(--active-tab-height) w-(--active-tab-width) rounded-full transition-[left,top,width,height] duration-[350ms] ease-apple-spring",
  })

  // 松手之后还要保持到胶囊滑到位，否则它会在半路上突然变实心；
  // 指针可能在列表外面松开，所以监听 window，键盘换 Tab 走同一条路。
  React.useEffect(() => {
    if (!lifted) return
    let timer = 0
    const settle = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setLifted(false), INDICATOR_SLIDE_MS)
    }
    const events = ["pointerup", "pointercancel", "keyup"] as const
    for (const type of events) window.addEventListener(type, settle)
    return () => {
      window.clearTimeout(timer)
      for (const type of events) window.removeEventListener(type, settle)
    }
  }, [lifted])

  /**
   * iOS 的分段控件：按住选中的胶囊可以直接把它拖到别的分段上。拖动时胶囊跟手 ——
   * 直接写行内 left（不过渡、也不触发 re-render），中心落到哪个分段就点一下那个
   * 分段，把值带过去；松手后交还给 --active-tab-left，它自己滑到最终那一段。
   */
  const startDrag = (event: React.PointerEvent<HTMLElement>) => {
    const list = event.currentTarget
    if (variant !== "default" || event.button !== 0) return
    if (list.closest('[data-slot="tabs"]')?.getAttribute("data-orientation") === "vertical") return
    const trigger = (event.target as HTMLElement).closest<HTMLElement>(TRIGGER)
    // 只有选中的那块胶囊能拖；按在别的分段上还是普通的点选。
    if (!trigger || !isSelected(trigger)) return
    drag.current = {
      pointerId: event.pointerId,
      grab: event.clientX - trigger.getBoundingClientRect().left,
      moved: false,
    }
    // 捕获失败（指针已经没了）也不该让按下这一下抛错，顶多是拖出列表就断。
    try {
      list.setPointerCapture(event.pointerId)
    } catch {}
  }

  const moveDrag = (event: React.PointerEvent<HTMLElement>) => {
    const state = drag.current
    const indicator = indicatorRef.current
    if (!state || !indicator || event.pointerId !== state.pointerId) return
    const list = event.currentTarget
    const listBox = list.getBoundingClientRect()
    const width = indicator.getBoundingClientRect().width
    const left = Math.min(
      Math.max(event.clientX - state.grab - listBox.left, LIST_PADDING),
      listBox.width - width - LIST_PADDING
    )
    state.moved = true
    indicator.style.left = `${left}px`
    // 分段有宽有窄，宽度仍然过渡；left 不过渡才跟得上手。
    indicator.style.transitionProperty = "width"
    const center = listBox.left + left + width / 2
    for (const tab of list.querySelectorAll<HTMLElement>(TRIGGER)) {
      const box = tab.getBoundingClientRect()
      if (center >= box.left && center <= box.right && !isSelected(tab)) tab.click()
    }
  }

  const endDrag = (event: React.PointerEvent<HTMLElement>) => {
    const state = drag.current
    if (!state || event.pointerId !== state.pointerId) return
    drag.current = null
    // 拖完松手会补一个 click，别让它把值又点回原来那一段。
    dragged.current = state.moved
    const indicator = indicatorRef.current
    if (!indicator) return
    indicator.style.left = ""
    indicator.style.transitionProperty = ""
  }

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        setLifted(true)
        startDrag(event)
      }}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={(event) => {
        if (!dragged.current) return
        dragged.current = false
        event.preventDefault()
        event.stopPropagation()
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.key.startsWith("Arrow")) setLifted(true)
      }}
      {...props}
    >
      {/* Before the tabs so it paints under them (and their focus rings). */}
      {variant === "default" && (
        <TabsPrimitive.Indicator
          ref={indicatorRef}
          renderBeforeHydration
          data-slot="tabs-indicator"
          {...glass.surface}
        >
          {glass.filter}
        </TabsPrimitive.Indicator>
      )}
      {children}
    </TabsPrimitive.List>
  )
}

function TabsTrigger({ className, children, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative z-0 inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-full px-4 text-[13px] font-medium whitespace-nowrap outline-none",
        // 胶囊在 z-10：未选中的标签留在它底下，这样滑过去时文字会被折射；选中的那个抬到它上面，保持清晰。
        "data-active:z-20",
        "text-label-secondary transition-colors duration-200 ease-apple",
        "group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start",
        "hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/45",
        "disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40",
        "data-active:text-foreground",
        "active:scale-[0.97] active:duration-75",
        // Line variant: an underline instead of a capsule.
        "group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:px-2",
        "group-data-[variant=line]/tabs-list:after:absolute group-data-[variant=line]/tabs-list:after:inset-x-0 group-data-[variant=line]/tabs-list:after:-bottom-1 group-data-[variant=line]/tabs-list:after:h-0.5 group-data-[variant=line]/tabs-list:after:rounded-full group-data-[variant=line]/tabs-list:after:bg-primary group-data-[variant=line]/tabs-list:after:opacity-0 group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="relative inline-flex items-center gap-1.5">
        {children}
      </span>
    </TabsPrimitive.Tab>
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger }

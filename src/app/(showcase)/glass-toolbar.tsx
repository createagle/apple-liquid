"use client"

import * as React from "react"
import { cn } from "cn"

import { useLiquidGlass } from "@/components/liquid-glass"

/**
 * 顶部工具栏 —— HIG 里液态玻璃的典型位置之一（“controls and navigation elements
 * — like tab bars and sidebars”）。常驻玻璃，内容从它下面滚过去时在下边缘被掰弯。
 *
 * 用 HIG 的 regular 档：底下滚过去的是整页文字，不糊掉的话再小的色散也会在字上
 * 糊出彩边。clear 档（glass-clear）留给浮在照片、视频之上的面，见 GlassSurface 那一节。
 */
function GlassToolbar({ className, children, ...props }: React.ComponentProps<"header">) {
  const glass = useLiquidGlass<HTMLElement>({ material: "pane" })

  return (
    <header
      {...glass.surface}
      className={cn("glass", className)}
      {...props}
      style={{ ...glass.surface.style, ...props.style }}
    >
      {glass.filter}
      {children}
    </header>
  )
}

export { GlassToolbar }

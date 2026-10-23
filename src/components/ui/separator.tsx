"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import { cn } from "cn"

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        // 竖线默认撑满一行的高度。这里用 h-full 而不是 self-stretch：
        // self-stretch 会盖掉外面 flex 容器的 items-center，一旦调用方再给个
        // 固定高度，竖线就会贴着顶边而不是居中。
        "shrink-0 bg-separator/40 data-horizontal:h-px data-horizontal:w-full data-vertical:h-full data-vertical:w-px",
        className
      )}
      {...props}
    />
  )
}

export { Separator }

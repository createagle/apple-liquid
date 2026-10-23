"use client"

import * as React from "react"
import { observeOnceInView } from "@/lib/observe-in-view"

/** 把 ref 挂在图片或占位元素上；首次进入视野后保持加载状态。 */
export function useInView() {
  const [node, setNode] = React.useState<HTMLElement | null>(null)
  const [inView, setInView] = React.useState(false)
  React.useEffect(() => {
    if (!node || inView) return
    return observeOnceInView(node, () => setInView(true))
  }, [node, inView])
  return { ref: setNode, inView }
}

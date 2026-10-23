import * as React from "react"
import { cn } from "cn"

import { ThemedParticles } from "@/components/particles"

type BackgroundVariant = "particles" | "aurora" | "spotlight" | "grid" | "plain"

interface BackgroundProps extends React.ComponentProps<"div"> {
  /**
   * `particles` 缓慢漂浮的 WebGL 粒子（组件默认；全站背景用的是 `aurora`）、`aurora` 大面积流动色晕、`spotlight` 顶部聚光、
   * `grid` 细网格、`plain` 只保留底色与噪点。
   */
  variant?: BackgroundVariant
  /** 叠加极细的噪点，消除大块渐变的色带。 */
  grain?: boolean
  /** 关掉色晕的缓慢漂移；用户系统开启「减少动态效果」时会自动关闭。 */
  animated?: boolean
}

type BlobStyle = React.CSSProperties & {
  "--aurora-tint": string
  "--aurora-duration": string
  "--aurora-delay"?: string
}

function tint(color: string, amount: number) {
  return `color-mix(in oklab, var(${color}) ${amount}%, transparent)`
}

/** 四团错开的色晕，尺寸和节奏都不一样，避免看出规律。 */
const AURORA_BLOBS: { className: string; style: BlobStyle }[] = [
  {
    className: "-top-[32%] -left-[14%] size-[46rem]",
    style: {
      "--aurora-tint": tint("--apple-indigo", 42),
      "--aurora-duration": "26s",
    },
  },
  {
    className: "-top-[24%] right-[-12%] size-[38rem]",
    style: {
      "--aurora-tint": tint("--apple-cyan", 38),
      "--aurora-duration": "32s",
      "--aurora-delay": "-8s",
    },
  },
  {
    className: "top-[28%] left-[34%] size-[34rem]",
    style: {
      "--aurora-tint": tint("--apple-purple", 26),
      "--aurora-duration": "38s",
      "--aurora-delay": "-16s",
    },
  },
  {
    className: "-bottom-[30%] left-[-8%] size-[42rem]",
    style: {
      "--aurora-tint": tint("--apple-teal", 30),
      "--aurora-duration": "30s",
      "--aurora-delay": "-4s",
    },
  },
]

function AuroraLayer({ animated }: { animated: boolean }) {
  return (
    <div className="absolute inset-0 opacity-90 dark:opacity-55">
      {AURORA_BLOBS.map((blob, index) => (
        <div
          key={index}
          className={cn("aurora-blob", blob.className, !animated && "animate-none")}
          style={blob.style}
        />
      ))}
    </div>
  )
}

/**
 * 通用页面背景。自带三层叠加（底色 → 图形层 → 噪点），
 * 明暗两套主题都调过，`children` 正常渲染在上层。
 *
 * ```tsx
 * <Background className="items-center justify-center p-6">
 *   <SignIn />
 * </Background>
 * ```
 */
function Background({
  variant = "particles",
  grain = true,
  animated = true,
  className,
  children,
  ...props
}: BackgroundProps) {
  return (
    <div
      data-slot="background"
      data-variant={variant}
      className={cn(
        "relative isolate flex flex-1 flex-col overflow-hidden bg-background",
        className
      )}
      {...props}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -z-10",
          grain && "bg-grain"
        )}
      >
        {variant === "particles" && (
          <ThemedParticles
            className="absolute inset-0"
            moveParticlesOnHover={animated}
            disableRotation={!animated}
            speed={animated ? 0.1 : 0}
            alphaParticles
          />
        )}
        {variant === "aurora" && <AuroraLayer animated={animated} />}
        {variant === "spotlight" && (
          <div className="bg-spotlight absolute inset-0" />
        )}
        {variant === "grid" && (
          <>
            <div className="bg-spotlight absolute inset-0 opacity-60" />
            <div className="bg-grid-fade absolute inset-0" />
          </>
        )}

        {/* 底部渐隐，让内容区和页脚之间有一层空气；粒子要铺满全屏，不加 */}
        {variant !== "particles" && (
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-background to-transparent" />
        )}
      </div>

      {children}
    </div>
  )
}

export { Background }
export type { BackgroundProps, BackgroundVariant }

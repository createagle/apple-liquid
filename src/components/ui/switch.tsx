"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { motion } from "motion/react"
import { cn } from "cn"

import { useLiquidGlass } from "@/components/liquid-glass"
import { motionSafe } from "@/lib/motion"

/**
 * Apple OS 27 switch.
 *
 * Figma: iOS "Toggles" / macOS "Toggles - Switches" (`207:14470`).
 * The kit's "on" track is Accents/Blue and the knob carries a soft
 * `0 3px 36px rgba(0,0,0,0.05)` shadow. iOS geometry (51x31 track, 27px
 * circular knob, 2px inset) is used here; macOS uses a wider pill knob.
 *
 * 旋钮静止时是实心的，按下、拖动的那一刻才变成液态玻璃，把轨道的蓝色和轨道外的
 * 页面在边缘掰弯 —— Apple HIG（Materials）说内容层不该用玻璃，唯一的例外就是
 * 「a transient interactive element like sliders and toggles … takes on a
 * Liquid Glass appearance … when a person activates it」。
 */
const SIZES = {
  default: { track: "h-[31px] w-[51px]", knob: "size-[27px]", travel: 20 },
  sm: { track: "h-[26px] w-[42px]", knob: "size-[22px]", travel: 16 },
} as const

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: keyof typeof SIZES
}) {
  const dims = SIZES[size]
  const glass = useLiquidGlass<HTMLSpanElement>({
    tone: "knob",
    trigger: "active",
    className: cn(
      "pointer-events-none relative block rounded-full [--lens-drop:var(--lens-drop-switch)]",
      dims.knob
    ),
  })

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      data-lens-active
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full p-[2px] outline-none",
        "transition-colors duration-300 ease-apple",
        "focus-visible:ring-[3px] focus-visible:ring-ring/45",
        "data-checked:bg-primary data-unchecked:bg-fill-primary",
        "data-disabled:cursor-not-allowed data-disabled:opacity-40",
        dims.track,
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        render={(thumbProps, state) => (
          <motion.span
            {...motionSafe(thumbProps)}
            {...glass.surface}
            style={{ ...thumbProps.style, ...glass.surface.style }}
            initial={false}
            animate={{ x: state.checked ? dims.travel : 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.7 }}
          >
            {glass.filter}
          </motion.span>
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }

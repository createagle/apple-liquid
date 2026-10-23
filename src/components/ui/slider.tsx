import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "cn"

import { useLiquidGlass } from "@/components/liquid-glass"

/**
 * Apple OS 27 slider — Figma: iOS "Sliders" (`507:24685`).
 *
 * Read off `State=Idle, Value=100%` (`520:49506`): the track and fill are 6px
 * tall with a 3px radius, and the knob is a 38x24 rounded rectangle — not a
 * circle — over a two-stop shadow.
 *
 * 旋钮和开关一样：静止时是实心的，按住拖动的那一刻才变成液态玻璃，把下面的轨道和
 * 页面在边缘掰弯 —— Apple HIG（Materials）对内容层控件的那条例外，见 switch.tsx。
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max]

  return (
    <SliderPrimitive.Root
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center py-2 select-none data-disabled:opacity-40 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-[3px] bg-fill-primary select-none data-horizontal:h-1.5 data-horizontal:w-full data-vertical:h-full data-vertical:w-1.5"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-primary select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderThumb key={index} />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

/** 每个旋钮各自量尺寸、各自一份滤镜，所以单独成一个组件（Hook 不能在循环里调）。 */
function SliderThumb() {
  const glass = useLiquidGlass<HTMLDivElement>({
    tone: "knob",
    trigger: "active",
    className: cn(
      // 38x24 rounded rectangle, straight from the kit.
      "relative block h-6 w-[38px] shrink-0 rounded-[12px] outline-none select-none",
      "[--lens-drop:var(--lens-drop-slider)]",
      "transition-transform duration-150 ease-apple",
      "after:absolute after:-inset-2",
      "focus-visible:ring-[3px] focus-visible:ring-ring/45",
      "active:scale-[1.06]",
      "disabled:pointer-events-none"
    ),
  })

  return (
    <SliderPrimitive.Thumb
      data-slot="slider-thumb"
      data-lens-active
      {...glass.surface}
    >
      {glass.filter}
    </SliderPrimitive.Thumb>
  )
}

export { Slider }

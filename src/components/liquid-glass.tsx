"use client"

import * as React from "react"
import { cn } from "cn"

/**
 * 液态玻璃透镜 —— 取自 React Bits 的 GlassSurface（reactbits.dev），
 * 只保留它的 SVG 位移贴图那条路径，去掉 WebGL、自定义形状等这里用不到的分支。
 *
 * 做法：按元素实际尺寸画一张位移贴图，红通道存横向位移、蓝通道存纵向位移，
 * 中间一块压成中性灰表示「不位移」，于是只有边缘把背后的画面掰弯 ——
 * Apple 的液态玻璃正是这样：中间清澈，边缘像一圈厚玻璃，还带一点色散
 * （RGB 三个通道给不同的位移量）。贴图经 `backdrop-filter: url(#…)` 作用在背景上。
 *
 * 材质必须加在控件本身，不能加在它内部的某一层（HIG：“apply the material
 * directly to the control, not its inner views”）—— 这里也是硬性的：
 * Chromium 下带 transform / translate 的元素会成为 backdrop root，
 * 放在它里面的那层取不到元素外面的画面，折射会变成一片空白。
 * 反过来，加在元素自己身上就没事：祖先（Floating UI 的 positioner）带 transform、
 * 元素自己带开场的 zoom/translate、整个弹出层 portal 到 body 外面，都照常折射。
 *
 * 两种玻璃，用 `material` 选：
 *
 * - `lens`（默认）：Tab 指示器、开关与滑块的旋钮那种小而厚的控件玻璃。整块都是玻璃，
 *   外观由 `glass-lens` 给（底色、高光、投影）。
 * - `pane`：导航层那层大而薄的玻璃 —— 工具栏、弹出层、菜单、抽屉。中间必须是清澈的，
 *   折射只在圆角那一圈，所以边缘带跟着圆角走而不是元素短边；外观沿用调用方自己的
 *   `.glass` / `glass-sheet`，这里只把折射叠到它的 backdrop-filter 上。
 *
 * ```tsx
 * const glass = useLiquidGlass<HTMLSpanElement>({ className: "rounded-full" })
 * <TabsPrimitive.Indicator {...glass.surface}>{glass.filter}</TabsPrimitive.Indicator>
 *
 * const glass = useLiquidGlass<HTMLDivElement>({ material: "pane" })
 * <Popup {...glass.surface}>{glass.filter}{children}</Popup>
 * ```
 *
 * 外观（底色、高光、边线、模糊量）全部来自 globals.css 的 `--lens-*` / `--pane-lens-*`，
 * 跟着明暗主题和外观设置里的玻璃通透度走；这里的选项只管「玻璃多厚」和「什么时候是玻璃」。
 */

/** 能做到哪一步：真折射 / 只磨砂 / 纯色。 */
type LiquidGlassTier = "refract" | "frost" | "flat"

/** 小而厚的控件玻璃，还是导航层那层大而薄的玻璃。 */
type LiquidGlassMaterial = "lens" | "pane"

interface UseLiquidGlassOptions {
  /** 一起写在控件上的类名，`lens` 还会并上 `glass-lens`，从 `surface.className` 出来。 */
  className?: string
  /** 哪一种玻璃，见文件头的说明。 */
  material?: LiquidGlassMaterial
  /** `knob` 是开关、滑块上的小圆块，底色更实，压在蓝色轨道上也要是白的。 */
  tone?: "surface" | "knob"
  /**
   * 什么时候是玻璃。`always` 给导航层那些常驻的玻璃表面；`active` 给分段控件的选中
   * 胶囊、滑块、开关这类长在内容层里的控件，按 Apple HIG 只在按下、拖动的那一刻
   * 取用玻璃。取用与否有两种判断方式，二选一：
   *
   * - 纯 CSS：在控件自己身上标 `data-lens-active`，按下（`:active`）或 Base UI 给出
   *   `data-dragging` 时就是玻璃。开关、滑块用这种。
   * - 调用方自己判断：传 `active`。分段控件要用这种 —— 胶囊松手后还要滑一段，
   *   纯 `:active` 会让它在半路上突然变实心。
   */
  trigger?: "always" | "active"
  /** 只在 `trigger` 为 `active` 时有意义：此刻是不是玻璃。不传则交给上面的 CSS 判断。 */
  active?: boolean
  /** 边缘那圈玻璃有多宽，按元素短边的比例算。 */
  edge?: number
  /** 折射强度，同样按短边的比例算：元素越小玻璃越薄，弯得也越少。 */
  strength?: number
  /** 色散：蓝通道比红通道多走的那一点位移，也是短边的比例。 */
  dispersion?: number
}

/**
 * 两种玻璃的几何与滤镜 token。
 *
 * `edge` 是边缘那圈玻璃的宽度，按元素短边算；`strength`、`dispersion` 则是「边缘圈」
 * （edge 带 + 压平用的那点模糊）的倍数 —— 位移量只能跟玻璃有多厚走。GlassSurface 把它
 * 写成固定的 -180，那是按 320×76 的小胶囊调的：同样的值放到快 2000px 宽的工具栏上，
 * 边缘的位移会超过工具栏本身的高度，背后的字直接被甩出去还散成红绿蓝三份。
 */
const MATERIALS = {
  lens: {
    // 内容层的控件是一块「薄」玻璃：弯曲只发生在边缘那一圈，中间要清澈 ——
    // iOS 的滑块旋钮压在轨道上，蓝条从中间直直穿过去，只在旋钮边上拐一下。
    //
    // 这个比例要小。压平中心用的灰块是模糊过的，影响范围约 3σ，而 softness 跟着
    // band 走，所以真正平坦的核心只有「短边 − 2×(band + 3×softness)」那么点：
    // band 占短边 16% 时，30px 的胶囊上核心几乎不剩，整块都落在过渡带里。
    edge: 0.1,
    // 中心压平那块的模糊跟着边缘带走：小控件整块都是玻璃，过渡要窄。
    softness: "band",
    // 要让折射更明显，先加宽 edge：位移上限是 rim × strength / 2，而 rim 跟着 band
    // 走，所以加宽边能等比放大弯曲，边缘的压缩率不变（它只跟 strength 有关）。
    strength: 1.8,
    // 色散是个放大器：三个通道的 scale 差 n 倍，核心里残留的亚像素偏差就会被拆成
    // 三条错开的彩色线，整块看上去都在动。0.3 时满屏彩虹，0.08 才只在边缘显色。
    dispersion: 0.08,
    cap: Infinity,
    blur: "var(--lens-blur)",
    frost: "var(--lens-blur-frost)",
    saturate: "var(--lens-saturate)",
  },
  pane: {
    // 几何照搬 GlassSurface：边缘带很窄，但中心那块用 11px 的模糊糊开，于是整面
    // 都带一点弯、边缘最狠 —— 官网那种「厚玻璃」的样子就是这么来的。
    edge: 0.05,
    softness: 11,
    strength: 2.6,
    // 同 lens：色散是放大器，大了会把核心的残差拆成满面彩边。
    dispersion: 0.08,
    cap: 120,
    blur: "var(--pane-lens-blur)",
    frost: "var(--pane-lens-blur)",
    saturate: "var(--pane-lens-saturate)",
  },
} as const satisfies Record<
  LiquidGlassMaterial,
  {
    edge: number
    softness: number | "band"
    strength: number
    dispersion: number
    cap: number
    blur: string
    frost: string
    saturate: string
  }
>

interface LensGeometry {
  width: number
  height: number
  radius: number
}

/** 贴图中间那块「不位移」的灰：50% 灰即零位移，留一点透明度让中心也有极轻微的弯曲。 */
const FLAT_FILL = "hsl(0 0% 50% / 0.93)"

/**
 * 位移贴图：黑底 + 横向红渐变 + 纵向蓝渐变（difference 混合，各占一个通道），
 * 再盖一块模糊过的中性灰把中间压平，只剩边框一圈 `band` px 宽有位移。
 *
 * 两条渐变必须同向（红往右涨、蓝往下涨）且起点是不透明的黑：
 *
 * - 方向反了就不是透镜。负的 scale 配上「红在左」，左右两边会往外采样（横向缩），
 *   而「蓝在下」让上下两边往里采样（纵向放）—— 一个缩一个放是马鞍面，看上去就是
 *   画面朝一个方向糊过去。四条边都往里采样才是凸透镜：中间几乎不动，只有四周弯。
 * - 起点图省事写 `#0000` 的话，透明黑到红之间颜色和 alpha 一起插值，合到黑底上
 *   成了 t² 的二次曲线，中点只有 64 而不是 128，零位移线跑到 t=√0.5 的地方，
 *   整块元素又带上一个同方向的净位移。
 */
function displacementMap(
  { width, height, radius }: LensGeometry,
  band: number,
  softness: number
) {
  const inset = Math.min(band, Math.min(width, height) / 2)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="x" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="black"/>
      <stop offset="100%" stop-color="red"/>
    </linearGradient>
    <linearGradient id="y" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="black"/>
      <stop offset="100%" stop-color="blue"/>
    </linearGradient>
    <filter id="s" x="0" y="0" width="${width}" height="${height}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="${softness}"/>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="black"/>
  <rect width="${width}" height="${height}" rx="${radius}" fill="url(#x)"/>
  <rect width="${width}" height="${height}" rx="${radius}" fill="url(#y)" style="mix-blend-mode:difference"/>
  <rect x="${inset}" y="${inset}" width="${Math.max(width - inset * 2, 0)}" height="${Math.max(height - inset * 2, 0)}" rx="${Math.max(radius - inset, 0)}" fill="${FLAT_FILL}" filter="url(#s)"/>
</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/** `rounded-full` 会算出 9999px，按短边的一半收一下才是实际的胶囊圆角。 */
function readRadius(node: Element, width: number, height: number) {
  const raw = getComputedStyle(node).borderTopLeftRadius
  const value = raw.endsWith("%")
    ? (parseFloat(raw) / 100) * Math.min(width, height)
    : parseFloat(raw)
  return Math.min(Number.isFinite(value) ? value : 0, Math.min(width, height) / 2)
}

/** 内核能力与屏幕无关，算一次缓存起来。 */
let capability: LiquidGlassTier | null = null

function glassCapability(): LiquidGlassTier {
  if (capability) return capability
  const supported =
    CSS.supports("backdrop-filter", "blur(1px)") ||
    CSS.supports("-webkit-backdrop-filter", "blur(1px)")
  // Safari、Firefox 认 backdrop-filter，但不渲染里面引用的 SVG 滤镜，
  // 语法检查看不出来，只能认内核，让它们退到纯模糊那档。
  const ua = navigator.userAgent
  const webkit = /\bSafari\//.test(ua) && !/\b(Chrome|Chromium|Edg|OPR)\//.test(ua)
  capability = !supported ? "flat" : webkit || /\bFirefox\//.test(ua) ? "frost" : "refract"
  return capability
}

function subscribeTransparency(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-transparency: reduce)")
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

function readTier(): LiquidGlassTier {
  return window.matchMedia("(prefers-reduced-transparency: reduce)").matches
    ? "flat"
    : glassCapability()
}

/** 服务端与水合首帧都按最保守的一档渲染，结构一致，不会闪。 */
function useLiquidGlassTier() {
  return React.useSyncExternalStore(
    subscribeTransparency,
    readTier,
    () => "flat" as const
  )
}

/**
 * 量的是藏在控件里的那张 `<svg>` 的父节点，也就是控件本身：
 * 这样调用方不用再交出一个 ref，不会和 Base UI 自己的 ref 打架。
 *
 * 锚点用 state 存而不是 ref object：弹出层要等用户点开才进 DOM，而 ref 挂上去
 * 不会让 effect 重跑 —— 第一遍 effect 什么也没量到就返回，之后再没有机会补。
 */
function useLensGeometry(anchor: SVGSVGElement | null, enabled: boolean) {
  const [geometry, setGeometry] = React.useState<LensGeometry | null>(null)

  React.useEffect(() => {
    const node = anchor?.parentElement
    if (!node || !enabled) return

    let timer = 0
    let last = ""
    const measure = () => {
      // offsetWidth / offsetHeight 不受 transform 影响：弹出层开场的 zoom-in 动画
      // 里 getBoundingClientRect 量到的是缩了 5% 的尺寸，而 ResizeObserver 看的是
      // border box，动画结束后不会再响一次，错的尺寸就那么留下了。
      const rect = node.getBoundingClientRect()
      const width = Math.round(node.offsetWidth || rect.width)
      const height = Math.round(node.offsetHeight || rect.height)
      if (!width || !height) return
      const radius = Math.round(readRadius(node, width, height))
      const key = `${width}:${height}:${radius}`
      if (key === last) return
      last = key
      setGeometry({ width, height, radius })
    }

    measure()
    // 指示器滑动时 ResizeObserver 每帧都响，而每帧重画一张 data URI 贴图太贵：
    // 等尺寸停下来再重算，滑动过程中让旧贴图拉伸顶着，几十毫秒里看不出来。
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer)
      timer = window.setTimeout(measure, 150)
    })
    observer.observe(node)
    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [anchor, enabled])

  return geometry
}

function useLiquidGlass<T extends HTMLElement = HTMLElement>(
  options: UseLiquidGlassOptions = {}
) {
  const {
    active,
    className,
    material = "lens",
    tone = "surface",
    trigger = "always",
  } = options
  const preset = MATERIALS[material]
  const edge = options.edge ?? preset.edge
  const strength = options.strength ?? preset.strength
  const dispersion = options.dispersion ?? preset.dispersion

  const [anchor, setAnchor] = React.useState<SVGSVGElement | null>(null)
  const tier = useLiquidGlassTier()
  const geometry = useLensGeometry(anchor, tier === "refract")
  const id = `lens-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`

  const refracting = tier === "refract" && geometry !== null
  // 边缘那圈玻璃有多厚：控件整块都是玻璃，按短边的比例；大块玻璃只在圆角那一圈，
  // 跟着圆角走（工具栏是直角，夹到下限，否则一圈都没有）。
  const short = geometry ? Math.min(geometry.width, geometry.height) : 0
  const band = short * edge
  const softness =
    preset.softness === "band" ? Math.max(band * 0.5, 1) : preset.softness
  // 位移只跟边缘那圈玻璃的宽度走（带 + 糊开的过渡），这样同一块玻璃不会因为
  // 变宽变高就弯得更狠；最远能把画面拉过来多少，大致是这个数的一半。
  const rim = band + softness
  // 负的 scale 把边缘的画面往里吸，玻璃才是「鼓」的；正的看起来像凹进去。
  const scale = (extra: number) =>
    -Math.min(rim * (strength + extra), preset.cap)

  // 算好的折射交给 CSS：常驻还是按下才用，由 globals.css 里 data-trigger 的规则决定。
  const filter = refracting
    ? `url(#${id}) blur(${preset.blur}) saturate(${preset.saturate})`
    : tier === "frost"
      ? `blur(${preset.frost}) saturate(${preset.saturate})`
      : "none"

  return {
    /** 展开到要变成玻璃的那个控件上。 */
    surface: {
      "data-lens": "",
      "data-tier": tier,
      "data-material": material,
      "data-tone": tone,
      "data-trigger": trigger,
      // 调用方自己判断的那种；不传 active 时不写这个属性，交给 CSS 的 :active。
      "data-lens-on": trigger === "active" && active ? "" : undefined,
      className: cn(material === "lens" && "glass-lens", className),
      style: {
        "--lens-filter-on": filter,
        // 大块玻璃的外观是调用方自己的 .glass / glass-sheet，折射得叠到它们已经写好的
        // backdrop-filter 上。写成行内样式是为了不跟那两个 @utility 争级联；真正用不用、
        // 用哪一档仍由 CSS 的 --lens-filter 决定。退化到纯模糊时整个不写，调用方原样保留。
        ...(material === "pane" && refracting
          ? {
              WebkitBackdropFilter: "var(--lens-filter)",
              backdropFilter: "var(--lens-filter)",
            }
          : null),
      } as React.CSSProperties,
    } satisfies React.HTMLAttributes<T> & Record<string, unknown>,

    /** 放进那个控件里：藏起来的滤镜定义，同时也是用来量尺寸的锚点。 */
    filter:
      tier === "refract" ? (
        <svg ref={setAnchor} aria-hidden focusable="false" className="absolute size-0">
          {geometry && (
            <defs>
              <filter
                id={id}
                colorInterpolationFilters="sRGB"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
              >
                {/* 尺寸必须写成像素。<filter> 上的百分比按 objectBoundingBox 算（就是
                    控件本身），但滤镜基元的 x/y/width/height 是 userSpaceOnUse，
                    百分比对的是这个 <svg> 锚点的 viewport —— 它是 size-0，于是贴图
                    被放错位置，整块画面带上一个固定方向的偏移。 */}
                <feImage
                  href={displacementMap(geometry, band, softness)}
                  x="0"
                  y="0"
                  width={geometry.width}
                  height={geometry.height}
                  preserveAspectRatio="none"
                  result="map"
                />
                {/* 三个通道分别位移再合回去，边缘就有了玻璃那一点点彩边。 */}
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="map"
                  scale={scale(0)}
                  xChannelSelector="R"
                  yChannelSelector="B"
                  result="shiftedRed"
                />
                <feColorMatrix
                  in="shiftedRed"
                  type="matrix"
                  values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                  result="red"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="map"
                  scale={scale(dispersion / 2)}
                  xChannelSelector="R"
                  yChannelSelector="B"
                  result="shiftedGreen"
                />
                <feColorMatrix
                  in="shiftedGreen"
                  type="matrix"
                  values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                  result="green"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="map"
                  scale={scale(dispersion)}
                  xChannelSelector="R"
                  yChannelSelector="B"
                  result="shiftedBlue"
                />
                <feColorMatrix
                  in="shiftedBlue"
                  type="matrix"
                  values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                  result="blue"
                />
                <feBlend in="red" in2="green" mode="screen" result="redGreen" />
                <feBlend in="redGreen" in2="blue" mode="screen" result="bent" />
                <feGaussianBlur in="bent" stdDeviation="0.4" />
              </filter>
            </defs>
          )}
        </svg>
      ) : null,
  }
}

export { useLiquidGlass }
export type { LiquidGlassMaterial, LiquidGlassTier, UseLiquidGlassOptions }

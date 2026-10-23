import type { PrimaryColor } from "@/lib/site-preferences"

/**
 * 跟随网站主色的 favicon。
 *
 * 浏览器标签页读不到页面里的 CSS 变量，只能按主色生成一份 SVG：
 * 根布局按 cookie 里的主色输出首屏图标，设置里改主色时再由
 * SitePreferencesProvider 换掉 <link rel="icon"> 的地址。
 *
 * 色值与 globals.css 的 --apple-* / --macos-pink 保持一致，改那边要同步这里。
 * 深色版放在 SVG 自己的 prefers-color-scheme 里，跟随的是浏览器明暗，
 * 不是站内的主题切换（标签页图标拿不到页面上的 .dark）。
 */
const PRIMARY_HEX: Record<PrimaryColor, { light: string; dark: string }> = {
  blue: { light: "#0088ff", dark: "#0a84ff" },
  indigo: { light: "#6155f5", dark: "#7d7aff" },
  purple: { light: "#cb30e0", dark: "#da51f2" },
  pink: { light: "#f74f9e", dark: "#ff6bb5" },
  red: { light: "#ff383c", dark: "#ff4245" },
  orange: { light: "#ff8d28", dark: "#ff9f0a" },
  yellow: { light: "#ffcc00", dark: "#ffd60a" },
  brown: { light: "#ac7f5e", dark: "#b59469" },
  green: { light: "#34c759", dark: "#30d158" },
  teal: { light: "#00c3d0", dark: "#40cbe0" },
}

/** 渐变终点：与 LogoMark 的 color-mix(in oklch, 主色 78%, white) 观感一致，这里按 sRGB 混。 */
function mixWithWhite(hex: string, amount = 0.22) {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return `#${channels
    .map((c) => Math.round(c + (255 - c) * amount).toString(16).padStart(2, "0"))
    .join("")}`
}

/** 与 LogoMark 同一套图形：圆角方块 + 主色渐变 + 顶部高光 + 白色鹰形线条。 */
function faviconSvg(color: PrimaryColor) {
  const { light, dark } = PRIMARY_HEX[color]
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none">\
<style>.a{stop-color:${light}}.b{stop-color:${mixWithWhite(light)}}\
@media (prefers-color-scheme:dark){.a{stop-color:${dark}}.b{stop-color:${mixWithWhite(dark)}}}</style>\
<defs><linearGradient id="g" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">\
<stop class="a"/><stop class="b" offset="1"/></linearGradient></defs>\
<rect width="40" height="40" rx="11.5" fill="url(#g)"/>\
<rect x=".5" y=".5" width="39" height="39" rx="11" stroke="#fff" stroke-opacity=".28"/>\
<g transform="translate(9.48 9.91) scale(.877)" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">\
<path d="M4 19c7 0 13-5 16-15-2 8-7 12-13 12 5 0 9-3 11-9-3 6-8 8-13 8"/><path d="M4 19 9 14"/></g></svg>`
}

/** 直接作为 <link rel="icon"> 的 href，不必再为每种主色单独出一个文件或路由。 */
export function faviconHref(color: PrimaryColor) {
  return `data:image/svg+xml,${encodeURIComponent(faviconSvg(color))}`
}

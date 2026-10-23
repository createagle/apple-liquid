/** 个人外观偏好：存在 cookie 里，首屏由一段同步脚本写到 <html> 上，之后由 SitePreferencesProvider 维护。 */
/** 可选主色：Apple 系统色按色相排列；薄荷绿、天蓝与青色太接近，不单独提供。 */
export const PRIMARY_COLORS = ["blue", "indigo", "purple", "pink", "red", "orange", "yellow", "brown", "green", "teal"] as const
export type PrimaryColor = (typeof PRIMARY_COLORS)[number]
/** 这几种主色偏亮，白字对比度只有 2:1 左右，主色上的文字和图标改用深色。 */
const LIGHT_PRIMARY_COLORS: readonly PrimaryColor[] = ["yellow", "teal"]
/** 内容配色在主色之外还用到天蓝（--content-cyan）。 */
const CONTENT_COLORS = [...PRIMARY_COLORS, "cyan"] as const
/** 玻璃通透度：通透、标准、着色，对应 globals.css 里 data-glass 的三档。 */
export const GLASS_LEVELS = ["clear", "regular", "tinted"] as const
export type GlassLevel = (typeof GLASS_LEVELS)[number]

export type SitePreferences = {
  primaryColor: PrimaryColor
  glass: GlassLevel
}

export const SITE_PREFERENCE_COOKIES = {
  primaryColor: "site_primary_color",
  glass: "site_glass",
} as const

export const DEFAULT_SITE_PREFERENCES: SitePreferences = {
  primaryColor: "blue",
  glass: "regular",
}

/**
 * 粉色取 macOS 强调色的粉（--macos-pink）：iOS 系统色里 pink 与 red 只差约 10° 色相，
 * 作为主色或分类色几乎分不出来。系统色 --apple-pink 保持原值，供装饰渐变使用。
 */
export const primaryColorValue = (color: PrimaryColor) =>
  color === "pink" ? "var(--macos-pink)" : `var(--apple-${color})`

/** 主色上文字、图标的颜色。 */
export const primaryForegroundValue = (color: PrimaryColor) =>
  LIGHT_PRIMARY_COLORS.includes(color) ? "#1a1a1a" : "#ffffff"

/** 内容页、分类、装饰图标的配色统一跟随网站主色。 */
export function sitePreferenceVariables(preferences: SitePreferences) {
  return {
    "--site-primary": primaryColorValue(preferences.primaryColor),
    "--site-primary-foreground": primaryForegroundValue(preferences.primaryColor),
    ...Object.fromEntries(
      CONTENT_COLORS.map((color) => [`--content-${color}`, "var(--site-primary)"])
    ),
  }
}

/** 只接受预设值，不把任意 cookie 内容插入 CSS。 */
export function readSitePreferences(cookies: { get: (name: string) => { value: string } | undefined }): SitePreferences {
  const primaryColor = cookies.get(SITE_PREFERENCE_COOKIES.primaryColor)?.value
  const glass = cookies.get(SITE_PREFERENCE_COOKIES.glass)?.value
  return {
    primaryColor: PRIMARY_COLORS.find((color) => color === primaryColor) ?? DEFAULT_SITE_PREFERENCES.primaryColor,
    glass: GLASS_LEVELS.find((level) => level === glass) ?? DEFAULT_SITE_PREFERENCES.glass,
  }
}

/** 浏览器里按同一套规则读 cookie（静态导出没有服务端，首屏也走这条路）。 */
export function readSitePreferencesFromDocument(): SitePreferences {
  if (typeof document === "undefined") return DEFAULT_SITE_PREFERENCES
  return readSitePreferences({
    get: (name) => {
      const match = new RegExp(`(?:^|; )${name}=([^;]*)`).exec(document.cookie)
      return match ? { value: decodeURIComponent(match[1]) } : undefined
    },
  })
}

/**
 * 首屏那段同步脚本的源码（放在 <body> 最上面，内容渲染之前执行）。
 *
 * 站点是静态导出的，服务端读不到 cookie，HTML 里带的是默认偏好；这段脚本在首次绘制前
 * 按 cookie 把真实偏好写到 <html> 上，所以主色和玻璃通透度都不闪。偏好值只从预设里取，
 * 不会把 cookie 内容原样插进 CSS。
 *
 * 顺带处理 viewport：iOS Safari 聚焦字号小于 16px 的输入框时会自动放大页面，而这里的输入框
 * 按 Apple 的规范多是 13 / 15px。给 iOS 加 maximum-scale=1 关掉自动放大：iOS 10 起双指缩放
 * 不受它限制，用户照样能手动放大。服务端拿不到 UA，所以同样放在这里判断。
 */
export function sitePreferencesScript() {
  const primaries = Object.fromEntries(
    PRIMARY_COLORS.map((color) => [color, [primaryColorValue(color), primaryForegroundValue(color)]])
  )
  return `(function(){try{
var P=${JSON.stringify(primaries)},C=${JSON.stringify(CONTENT_COLORS)},G=${JSON.stringify(GLASS_LEVELS)},r=document.documentElement;
function c(n){var m=new RegExp("(?:^|; )"+n+"=([^;]*)").exec(document.cookie);return m?decodeURIComponent(m[1]):""}
var p=P[c(${JSON.stringify(SITE_PREFERENCE_COOKIES.primaryColor)})];
if(p){r.style.setProperty("--site-primary",p[0]);r.style.setProperty("--site-primary-foreground",p[1]);
for(var i=0;i<C.length;i++)r.style.setProperty("--content-"+C[i],"var(--site-primary)")}
var g=c(${JSON.stringify(SITE_PREFERENCE_COOKIES.glass)});if(G.indexOf(g)>=0)r.dataset.glass=g;
if(/iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)){var m=document.querySelector('meta[name=viewport]');
if(m)m.setAttribute("content","width=device-width, initial-scale=1, maximum-scale=1")}
}catch(e){}})()`
}

"use client"

import * as React from "react"

import { faviconHref } from "@/lib/favicon"
import {
  DEFAULT_SITE_PREFERENCES,
  readSitePreferencesFromDocument,
  sitePreferenceVariables,
  SITE_PREFERENCE_COOKIES,
  type SitePreferences,
} from "@/lib/site-preferences"

const SitePreferencesContext = React.createContext<{
  preferences: SitePreferences
  updatePreferences: (changes: Partial<SitePreferences>) => void
} | null>(null)

/**
 * 与明暗模式独立：偏好存在 cookie 里，修改时同步 CSS 变量、玻璃通透度（<html data-glass>）和标签页图标。
 *
 * 站点是静态导出的，服务端读不到 cookie，所以 HTML 里带的是默认偏好：首次绘制前由
 * sitePreferencesScript 按 cookie 改好 <html> 上的变量（视觉上不闪），这里再在挂载后把同一份
 * cookie 读进 state —— 只影响设置面板里哪一项显示为选中，面板是点开才看的，看不出来。
 * 标签页图标也放在这里换：服务端出的是默认蓝色，图标不参与绘制，不必抢在首屏之前。
 */
export function SitePreferencesProvider({
  initialPreferences = DEFAULT_SITE_PREFERENCES,
  children,
}: {
  initialPreferences?: SitePreferences
  children: React.ReactNode
}) {
  const [preferences, setPreferences] = React.useState(initialPreferences)

  React.useEffect(() => {
    const stored = readSitePreferencesFromDocument()
    setPreferences(stored)
    if (stored.primaryColor !== DEFAULT_SITE_PREFERENCES.primaryColor) setFaviconColor(stored.primaryColor)
  }, [])

  const updatePreferences = (changes: Partial<SitePreferences>) => {
    const next = { ...preferences, ...changes }
    const secure = location.protocol === "https:" ? "; Secure" : ""
    for (const key of Object.keys(changes) as (keyof SitePreferences)[]) {
      document.cookie = `${SITE_PREFERENCE_COOKIES[key]}=${next[key]}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`
    }
    for (const [key, value] of Object.entries(sitePreferenceVariables(next))) {
      document.documentElement.style.setProperty(key, value)
    }
    document.documentElement.dataset.glass = next.glass
    // 标签页图标读不到 CSS 变量，换主色时直接换掉 SVG 图标的地址。
    if (changes.primaryColor) setFaviconColor(next.primaryColor)
    setPreferences(next)
  }

  return (
    <SitePreferencesContext value={{ preferences, updatePreferences }}>
      {children}
    </SitePreferencesContext>
  )
}

function setFaviconColor(color: SitePreferences["primaryColor"]) {
  document
    .querySelector<HTMLLinkElement>('link[rel="icon"][type="image/svg+xml"]')
    ?.setAttribute("href", faviconHref(color))
}

export function useSitePreferences() {
  const context = React.useContext(SitePreferencesContext)
  if (!context) throw new Error("SitePreferencesProvider is required")
  return context
}

/**
 * 内容页、分类、装饰图标统一跟随全站主色。分类自带的颜色不再单独生效，
 * 但参数保留着：调用方仍然照原样传分类色，这里直接忽略。
 */
export function useContentColor(categoryColor?: string | null) {
  void categoryColor
  return "var(--site-primary)"
}

/** 列表可在循环前取一次解析器，为每个分类解析颜色。 */
export function useContentColorResolver() {
  return (categoryColor?: string | null) => {
    void categoryColor
    return "var(--site-primary)"
  }
}

export function useContentAccent(
  categoryColor?: string | null,
  variable?: "--course-accent" | "--roadmap-accent" | "--showcase-accent",
) {
  const color = useContentColor(categoryColor)
  return {
    "--primary": color,
    "--ring": color,
    ...(variable && { [variable]: color }),
  } as React.CSSProperties
}

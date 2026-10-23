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
 * 偏好的唯一来源是 cookie 和 <html> 上的变量，React 这边不另存一份。
 *
 * 站点是静态导出的，服务端读不到 cookie：HTML 里是默认偏好，首次绘制前由
 * sitePreferencesScript 按 cookie 改好 <html>（视觉上不闪），React 则在
 * hydration 之后从 getServerSnapshot 切到 getSnapshot，自然拿到同一份 cookie。
 */
const listeners = new Set<() => void>()
let snapshot: SitePreferences | null = null

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
const getSnapshot = () => (snapshot ??= readSitePreferencesFromDocument())
const getServerSnapshot = () => DEFAULT_SITE_PREFERENCES

/** 写 cookie，同步 CSS 变量和玻璃通透度（<html data-glass>），再通知订阅者。 */
function updatePreferences(changes: Partial<SitePreferences>) {
  const next = { ...getSnapshot(), ...changes }
  const secure = location.protocol === "https:" ? "; Secure" : ""
  for (const key of Object.keys(changes) as (keyof SitePreferences)[]) {
    document.cookie = `${SITE_PREFERENCE_COOKIES[key]}=${next[key]}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`
  }
  for (const [key, value] of Object.entries(sitePreferenceVariables(next))) {
    document.documentElement.style.setProperty(key, value)
  }
  document.documentElement.dataset.glass = next.glass
  snapshot = next
  for (const listener of listeners) listener()
}

export function SitePreferencesProvider({ children }: { children: React.ReactNode }) {
  const preferences = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  // 标签页图标读不到 CSS 变量，只能按主色换掉 <link rel="icon"> 的地址。
  React.useEffect(() => {
    document
      .querySelector<HTMLLinkElement>('link[rel="icon"][type="image/svg+xml"]')
      ?.setAttribute("href", faviconHref(preferences.primaryColor))
  }, [preferences.primaryColor])

  const value = React.useMemo(() => ({ preferences, updatePreferences }), [preferences])

  return <SitePreferencesContext value={value}>{children}</SitePreferencesContext>
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

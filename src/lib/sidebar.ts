/**
 * 侧边栏的展开状态、宽度都记在 cookie 里，服务端渲染时读出来，刷新后不跳。
 *
 * 放在这里而不是 components/ui/sidebar.tsx：那个文件是 "use client"，
 * 服务端组件从它引常量拿到的是客户端引用，不是值。
 */
export const SIDEBAR_STATE_COOKIE = "sidebar_state"
export const SIDEBAR_WIDTH_COOKIE = "sidebar_width"
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

/** 展开时的宽度（px）：默认就是最小宽度 16rem，最多拉到两倍。 */
export const SIDEBAR_MIN_WIDTH = 256
export const SIDEBAR_MAX_WIDTH = SIDEBAR_MIN_WIDTH * 2

export function clampSidebarWidth(width: number) {
  if (!Number.isFinite(width)) return SIDEBAR_MIN_WIDTH
  return Math.round(Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, width)))
}

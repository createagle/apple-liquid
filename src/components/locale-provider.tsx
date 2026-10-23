"use client"

import * as React from "react"
import { IntlayerProvider } from "next-intlayer"
import { Locales, type LocalesValues } from "intlayer"

/** 与 intlayer.config.ts 的 defaultLocale 保持一致。 */
const DEFAULT_LOCALE: LocalesValues = Locales.ENGLISH

/**
 * 客户端的语言上下文（组件里的 useIntlayer 读它）。
 *
 * 展示页是静态导出的，没有服务端，拿不到 Accept-Language，所以整站固定按默认语言渲染。
 *
 * 不要改成「挂载后按 navigator.language 切一次」：React 19 的 hydration 是可中断的，
 * 根布局那棵树先 hydrate 完、切语言的那次更新就生效了，等轮到页面那棵树时 context 已经
 * 是中文、而 HTML 里是英文，于是每次打开都报一次水合不匹配（React #418）。
 * useEffect 和 useSyncExternalStore 都绕不开这一点 —— 两者都要等组件挂载，
 * 而「挂载」在选择性 hydration 下本来就是分批发生的。静态页面只能有一种语言。
 *
 * 要按请求语言出首屏，就得有服务端：把这里换成 next-intlayer/server 的 IntlayerProvider
 * 并传 getLocale()，同时去掉 next.config.ts 里的 output: "export"。
 * 要在静态页面上支持中英切换，就得做成用户点击触发（点击发生在 hydration 之后，是安全的）。
 */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  return (
    <IntlayerProvider locale={DEFAULT_LOCALE} isCookieEnabled={false}>
      {children}
    </IntlayerProvider>
  )
}

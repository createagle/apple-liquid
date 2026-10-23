"use client"

import * as React from "react"
import { IntlayerProvider, useLocale } from "next-intlayer"
import { Locales, type LocalesValues } from "intlayer"

/** 与 intlayer.config.ts 的 defaultLocale 保持一致：静态 HTML 是按它渲染的。 */
const DEFAULT_LOCALE: LocalesValues = Locales.ENGLISH

/**
 * 客户端的语言上下文（组件里的 useIntlayer 读它）。
 *
 * 站点是静态导出的，没有服务端，拿不到 Accept-Language，所以静态 HTML 里是默认语言（英文）；
 * 挂载后再按浏览器语言切一次。语言不写 cookie（站内也没有切换入口），每次都按浏览器语言判断。
 *
 * locale 必须显式传：不传的话 IntlayerProvider 会在 hydration 的那一次渲染里去读
 * INTLAYER_LOCALE cookie。cookie 是按域共享的，createagle.github.io 上别的站点写过这个
 * cookie，于是客户端首次渲染出中文、而静态 HTML 是英文，React 直接报水合不匹配。
 *
 * 需要 Accept-Language 在首屏就生效的站点，把这里换成 next-intlayer/server 的 IntlayerProvider
 * 并传 getLocale() 即可，但那样页面就不能静态导出了。
 */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = React.useState<LocalesValues>(DEFAULT_LOCALE)

  return (
    <IntlayerProvider locale={locale} setLocale={setLocale} isCookieEnabled={false}>
      <BrowserLocale />
      {children}
    </IntlayerProvider>
  )
}

/** 按 navigator.languages 在可用语言里挑一个，挑不到就留着默认语言。 */
function BrowserLocale() {
  const { locale, availableLocales, setLocale } = useLocale()

  React.useEffect(() => {
    const tags = navigator.languages?.length ? navigator.languages : [navigator.language]
    for (const tag of tags) {
      const base = tag.toLowerCase().split("-")[0]
      const match = availableLocales.find((available) => String(available).toLowerCase().split("-")[0] === base)
      if (match) {
        if (match !== locale) setLocale(match)
        return
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

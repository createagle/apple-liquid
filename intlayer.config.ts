import { Locales, type IntlayerConfig } from "intlayer"

/**
 * 多语言配置（Intlayer）。
 *
 * - 暂时只有英文和中文，默认英文。
 * - URL 里不带语言标识（no-prefix）：/sign-in 在两种语言下都是 /sign-in。
 *   当前语言按「用户手动切换过的 cookie → 浏览器 Accept-Language → 默认英文」
 *   依次判断。页面（next-intlayer 的 getLocale）和接口（src/lib/locale.ts）
 *   走的是同一套顺序，所以页面、接口报错、验证码邮件总是同一种语言。
 *   首次访问没有 cookie，自然就落到浏览器语言上；切换语言才会写 cookie。
 * - 每个组件一份 `xxx.content.ts`，里面用 `t({ en, zh })` 同时写两种语言，
 *   和用到它的组件放在同一个目录。
 */
const config: IntlayerConfig = {
  internationalization: {
    locales: [Locales.ENGLISH, Locales.CHINESE],
    defaultLocale: Locales.ENGLISH,
  },
  routing: {
    mode: "no-prefix",
  },
  content: {
    // 默认会扫整个项目，.open-next、.wrangler 这类构建产物也在里面。
    contentDir: ["./src"],
    codeDir: ["./src"],
  },
}

export default config

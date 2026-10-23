import { t, type Dictionary } from "intlayer"

const content = {
  key: "dialog",
  content: {
    details: t({ en: "Details", zh: "详情" }),
    close: t({ en: "Close", zh: "关闭" }),
    fullscreen: t({ en: "Fullscreen", zh: "全屏" }),
    restore: t({ en: "Restore", zh: "退出全屏" }),
  },
} satisfies Dictionary

export default content

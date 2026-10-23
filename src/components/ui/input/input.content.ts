import { t, type Dictionary } from "intlayer"

const content = {
  key: "password-input",
  content: {
    show: t({ en: "Show password", zh: "显示密码" }),
    hide: t({ en: "Hide password", zh: "隐藏密码" }),
  },
} satisfies Dictionary

export default content

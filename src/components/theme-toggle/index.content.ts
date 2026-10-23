import { t, type Dictionary } from "intlayer"

const content = {
  key: "theme-toggle",
  content: {
    label: t({ en: "Appearance", zh: "外观" }),
    options: {
      light: t({ en: "Light", zh: "浅色" }),
      dark: t({ en: "Dark", zh: "深色" }),
      system: t({ en: "System", zh: "跟随系统" }),
    },
  },
} satisfies Dictionary

export default content

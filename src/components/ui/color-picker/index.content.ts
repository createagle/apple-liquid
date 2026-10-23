import { t, type Dictionary } from "intlayer"

export default {
  key: "color-picker",
  content: {
    title: t({ en: "Choose color", zh: "选择颜色" }),
    label: t({ en: "Color", zh: "颜色" }),
    clear: t({ en: "Clear color", zh: "清空颜色" }),
    presets: t({ en: "Preset colors", zh: "预设颜色" }),
    placeholder: t({ en: "Enter a color, e.g. #2563eb", zh: "请输入颜色，如 #2563eb" }),
  },
} satisfies Dictionary

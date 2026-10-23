import { t, type Dictionary } from "intlayer"

const content = {
  key: "field",
  content: {
    hint: t({ en: "Show hint", zh: "查看说明" }),
    required: t({ en: "Required", zh: "必填" }),
  },
} satisfies Dictionary

export default content

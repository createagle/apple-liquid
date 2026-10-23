import { t, type Dictionary } from "intlayer"

const content = {
  key: "root-layout",
  content: {
    metadata: {
      title: "Apple Liquid",
      description: t({
        en: "shadcn/ui restyled to the Apple OS 27 design language",
        zh: "按 Apple OS 27 设计语言重新设计的 shadcn/ui",
      }),
    },
  },
} satisfies Dictionary

export default content

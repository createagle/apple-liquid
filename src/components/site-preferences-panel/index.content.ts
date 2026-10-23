import { t, type Dictionary } from "intlayer"

const content = {
  key: "site-preferences-panel",
  content: {
    primaryTitle: t({ en: "Primary color", zh: "网站主色" }),
    primaryDescription: t({ en: "Choose the accent color for navigation, buttons and links.", zh: "选择导航、按钮和链接使用的主色。" }),
    colors: {
      blue: t({ en: "Blue", zh: "蓝色" }),
      indigo: t({ en: "Indigo", zh: "靛蓝" }),
      purple: t({ en: "Purple", zh: "紫色" }),
      pink: t({ en: "Pink", zh: "粉色" }),
      red: t({ en: "Red", zh: "红色" }),
      orange: t({ en: "Orange", zh: "橙色" }),
      yellow: t({ en: "Yellow", zh: "黄色" }),
      brown: t({ en: "Brown", zh: "棕色" }),
      green: t({ en: "Green", zh: "绿色" }),
      teal: t({ en: "Teal", zh: "青色" }),
    },
    glassTitle: t({ en: "Glass transparency", zh: "玻璃通透度" }),
    glassDescription: t({
      en: "Adjust the frosted-glass surfaces across the site: navigation, buttons, cards, menus and sheets.",
      zh: "统一调整全站的毛玻璃效果，包括导航、按钮、卡片、弹出菜单和底部抽屉。",
    }),
    glassLevels: {
      clear: {
        title: t({ en: "Clear", zh: "通透" }),
        description: t({ en: "More see-through, letting more color show through.", zh: "更加通透，透出更多背后的色彩。" }),
      },
      regular: {
        title: t({ en: "Regular", zh: "标准" }),
        description: t({ en: "The default balance of transparency and legibility.", zh: "默认效果，兼顾通透与清晰。" }),
      },
      tinted: {
        title: t({ en: "Tinted", zh: "着色" }),
        description: t({ en: "More opaque with higher contrast for easier reading.", zh: "底色更实、对比更高，文字更易读。" }),
      },
    },
    savedHint: t({ en: "Changes apply immediately and are saved in this browser.", zh: "修改立即生效，并保存在当前浏览器。" }),
  },
} satisfies Dictionary

export default content

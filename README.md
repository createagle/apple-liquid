# apple-liquid

shadcn/ui（base-nova 风格，底层 [Base UI](https://base-ui.com)）按 Apple OS 27 / Liquid Glass
设计语言重新设计的一套组件：66 个组件，明暗两套主题，10 种 Apple 系统主色，三档玻璃通透度，
以及用 SVG 位移贴图做的真·液态玻璃折射。

**展示页：<https://createagle.github.io/apple-liquid/>**

顶部「Appearance」可以切主色、玻璃通透度，下面所有组件会跟着变。
展示页是静态页面，拿不到请求头，所以固定显示英文；组件本身的文案是中英双语的，
装到有服务端的项目里会跟着请求语言走。

## 安装

组件以 [shadcn registry](https://ui.shadcn.com/docs/registry) 的形式发布，
CLI 会把源码复制进你的项目 —— 装完就是你自己的代码，和 shadcn/ui 一样。

下面的命令都实际跑通过。示例用 pnpm，换成 `npx` / `yarn dlx` / `bunx --bun` 同理。

### 从零新建一个项目

什么都没有的话，`init` 一步到位：建好项目、配好 base-nova，并把整套设计 token
装进去（末尾那个 `theme.json` 就是 token，不带它就只是个普通 shadcn 项目）。
跑起来会问一次项目名：

```bash
pnpm dlx shadcn@latest init --template next --base base --preset nova \
  https://createagle.github.io/apple-liquid/r/theme.json
```

`--template` 还支持 `vite`、`react-router`、`astro`、`start`、`laravel`。

生成的 `components.json` 里 `registries` 是空的，所以接着做下面「注册命名空间」那步。

### 在已有项目里接入

项目需要是 Tailwind CSS v4，并且 `shadcn init` 过：

```bash
pnpm dlx shadcn@latest init --preset nova --base base
```

### 注册命名空间（可选，一次）

在 `components.json` 里加上这段，之后就能用短名字装，不用每次贴 URL：

```json
{
  "registries": {
    "@apple-liquid": "https://createagle.github.io/apple-liquid/r/{name}.json"
  }
}
```

### 装单个组件

```bash
# 用 URL
pnpm dlx shadcn@latest add https://createagle.github.io/apple-liquid/r/button.json

# 注册过命名空间之后
pnpm dlx shadcn@latest add @apple-liquid/button
```

### 装多个

```bash
pnpm dlx shadcn@latest add @apple-liquid/button @apple-liquid/card @apple-liquid/slider
```

### 看有哪些可装

74 个 item：66 个组件，加上它们依赖的 8 个共享能力。

```bash
pnpm dlx shadcn@latest list @apple-liquid
```

### 一次装全部 66 个

`shadcn add --all` 只对默认 registry 生效，自定义 registry 用不了，
所以把 `list` 的输出喂给 `add`（需要先注册命名空间）：

```bash
pnpm dlx shadcn@latest add $(pnpm dlx shadcn@latest list @apple-liquid -t ui --json \
  | node -pe "JSON.parse(require('fs').readFileSync(0,'utf8')).items.map(i=>i.addCommandArgument).join(' ')")
```


### 装过去会发生什么

每个组件都依赖基础 item `theme`，所以第一次安装时会多出两样东西：

- `styles/apple-liquid.css` —— 全部设计 token（Apple 系统色、玻璃材质、字号、圆角，明暗两套）。
  项目有 `src/` 的话就在 `src/styles/` 下，没有就在根目录；
- 入口 CSS（Next.js 下是 `app/globals.css`）里多一行 `@import "../styles/apple-liquid.css";`。

入口 CSS 不在 `app/` 下（比如 Vite 的 `src/index.css`），把那行 `@import` 的相对路径改对即可。

组件之间互相引用的部分（`liquid-glass`、`use-mobile`、`mobile-sheet` 等）会作为
`registryDependencies` 自动带上，npm 依赖（`@base-ui/react`、`cn`、`lucide-react`……）也会自动装。

`cn` 是直接从 npm 的 [`cn`](https://www.npmjs.com/package/cn) 包引的，不走 `@/lib/utils`，
所以你项目里原有的 `lib/utils.ts` 不会被覆盖。

### 明暗模式

深色主题挂在 `<html class="dark">` 上，和 shadcn 的约定一致，用
[next-themes](https://github.com/pacocoursey/next-themes) 之类的即可。
想连主色、玻璃通透度一起做成可切换的，装 `site-preferences` 和 `theme-toggle`。

### 关于 Intlayer（重要）

有几个组件的内置文案（「显示密码」「关闭」「加载中」这类）走
[Intlayer](https://intlayer.org)，文案放在同目录的 `*.content.ts` 里，用 `t({ en, zh })`
同时写中英文。涉及的组件：**`dialog`、`input`、`field`、`color-picker`、`spinner`、
`theme-toggle`、`site-preferences`**。

这是有意保留的：这套组件本来就是双语站点在用的，把文案内联会丢掉中文。
代价是这几个组件要求你的项目也配好 Intlayer —— 只装依赖不配置的话，
`@intlayer/config` 会被打进浏览器包，构建会直接报 `Can't resolve 'child_process'`。

三步配齐（`shadcn add` 已经帮你装好了 `intlayer` / `next-intlayer`）：

1. 根目录放 `intlayer.config.ts`：

   ```ts
   import { Locales, type IntlayerConfig } from "intlayer"

   const config: IntlayerConfig = {
     internationalization: { locales: [Locales.ENGLISH, Locales.CHINESE], defaultLocale: Locales.ENGLISH },
     routing: { mode: "no-prefix" },
     content: { contentDir: ["./src"], codeDir: ["./src"] },
   }

   export default config
   ```

2. `next.config.ts` 用 `withIntlayer` 包一层：

   ```ts
   import { withIntlayer } from "next-intlayer/server"
   export default withIntlayer(nextConfig)
   ```

3. 根布局里挂上 provider：`import { IntlayerProvider } from "next-intlayer"`，
   包住 `{children}`。想按浏览器语言自动切，装 `locale-provider`。

**不想引入 Intlayer** 的话，把这几个文件里的 `useIntlayer("key")` 换成一个写死文案的常量对象，
再删掉同目录的 `*.content.ts` 即可。注意代码里有些地方用的是 `content.foo.value`
（Intlayer 节点取纯文本），换成普通字符串时要一并去掉 `.value`。

## 本地开发这个仓库

```bash
pnpm install
pnpm dev          # 展示页 http://localhost:3000
pnpm build        # shadcn build（生成 public/r/*.json）+ next build 静态导出到 out/
pnpm registry     # 只生成 registry
pnpm typecheck
pnpm lint
```

目录职责、组件约定和 registry 的维护规则见 [AGENTS.md](./AGENTS.md)。

## 浏览器支持

液态玻璃的折射用的是 `backdrop-filter` 里引用 SVG 滤镜，目前只有 Chromium 渲染；
Safari / Firefox 自动退到纯模糊，版式完全一样。用户在系统里开「减少透明度」时退到不透明。

## 来源

- 组件底座：[shadcn/ui](https://ui.shadcn.com) base-nova + [Base UI](https://base-ui.com)
- 设计语言：Apple Design Resources 的 iOS / iPadOS 27、macOS 27 Figma kit
- `glass-surface` 组件原样取自 [React Bits](https://reactbits.dev) 的 GlassSurface

# apple-liquid

从 createagle-docs 抽离出来的组件库：shadcn/ui（base-nova，底层 Base UI）按 Apple OS 27 / Liquid Glass 设计语言重新设计，
附带一个展示页。技术栈：Next.js App Router、React、TypeScript、Tailwind CSS v4、Intlayer，使用 pnpm 管理依赖。
跨目录引用使用 `@/`（对应 `src/`）。

| 目录 | 职责 |
| --- | --- |
| [src/components/ui/](./src/components/ui/) | UI 基础组件及其小变体 |
| [src/components/](./src/components/) | 主题、外观偏好、粒子背景、液态玻璃透镜等跨组件能力 |
| [src/styles/apple-liquid.css](./src/styles/apple-liquid.css) | 设计 token：Apple 系统色、材质（玻璃）、字号、圆角，明暗两套 |
| [src/app/globals.css](./src/app/globals.css) | Tailwind 入口：只有几行 `@import`，token 从上面那个文件引进来 |
| [src/app/(showcase)/](./src/app/(showcase)/) | 组件展示页（`/`） |
| [src/lib/](./src/lib/) | 通用工具：`cn`、外观偏好、Motion 兼容等 |
| [src/hooks/](./src/hooks/) | `useIsMobile`、`useInView` |
| [registry.json](./registry.json) | shadcn registry：每个组件一个 item，见下面「registry」 |
| [.github/workflows/pages.yml](./.github/workflows/pages.yml) | 展示页和 registry 一起发到 GitHub Pages |

# 组件约定

1. **UI 基础组件的小变体并入对应文件，不单独建文件。**
   例如 `ErrorAlert` 在 [alert.tsx](./src/components/ui/alert.tsx)，
   `PasswordInput` 在 [input.tsx](./src/components/ui/input/input.tsx)，
   `OverflowTooltip` 在 [tooltip.tsx](./src/components/ui/tooltip.tsx)。
2. **颜色、材质只用 token。** 组件里不写死颜色值，使用
   [apple-liquid.css](./src/styles/apple-liquid.css) 里的变量和对应的 Tailwind 类
   （如 `bg-fill-tertiary`、`text-label-secondary`、`glass`、`--site-primary`）。
   那个文件里几块 token 的选择器写成了双份（`:root:root`、`.dark.dark`、
   `[data-glass="x"][data-glass]`），是为了装到别的项目里时不被 `shadcn init` 生成的
   `:root` / `.dark` 盖掉，加新 token 时照着写。
3. **悬浮内容的移动端行为沿用组件统一实现。** 宽度小于 768px 时，Select、DropdownMenu 等选择器和菜单改为底部 sheet；
   Tooltip、HoverCard 在移动端默认不显示，也不拦截触发器的点击；仅纯展示型触发器传 `mobileTap`，
   点击打开居中 Dialog。Popover 保持现有行为。文本溢出展示使用 `OverflowTooltip`（已内置 `mobileTap`）。
4. **组件文案放在同目录的 `*.content.ts`**，用 `t({ en, zh })` 同时写中英文。
   展示页本身是静态导出的，拿不到 Accept-Language，固定按默认语言（英文）渲染 ——
   原因和「别改成挂载后自动切」见 [locale-provider.tsx](./src/components/locale-provider.tsx)。
   用这些组件的站点只要有服务端，照常用 `next-intlayer/server` 的 `IntlayerProvider` 就是双语的。
5. **外观偏好**（主色、玻璃通透度、粒子背景、内容配色）存在 cookie 里，由
   [SitePreferencesProvider](./src/components/site-preferences-provider.tsx) 写到 `<html>` 的 CSS 变量和 `data-glass` 上。
6. **液态玻璃（折射）按 Apple HIG 的 Materials 决定用在哪。** 常驻玻璃只给浮在内容之上的
   导航层 —— 工具栏、侧边栏、弹出层、菜单、抽屉（`material: "pane"`）。大块玻璃按 HIG 分两档：
   默认 regular（照旧重模糊，菜单、弹出层里都是要读的字，背后内容必须糊掉）；浮在照片、
   视频这类画面之上的面加 `glass-clear`，不模糊、底色只剩一层很淡的 frost，背后看得清
   才谈得上折射。分段控件的选中胶囊、滑块、开关长在内容层里，静止时是实心的，
   只在按下、拖动的那一瞬间取用玻璃（`trigger: "active"`，HIG 对内容层控件的唯一例外）。
   内容本身不要用玻璃，也不要玻璃叠玻璃。
   浮在照片、视频之上、而且 DOM 归我们自己生成的面，直接用原样搬来的
   [glass-surface.tsx](./src/components/ui/glass-surface.tsx)（React Bits 的 GlassSurface，
   展示页 `#glass-surface` 那一节就是它官网 demo 的参数），别在那个文件里改设计。
   Base UI 渲染的元素只能用下面这个 hook。实现见
   [liquid-glass.tsx](./src/components/liquid-glass.tsx) 的 `useLiquidGlass`：
   材质加在控件本身（带 transform 的元素会成为 backdrop root，套在里面的一层取不到
   外面的画面），外观只读 [apple-liquid.css](./src/styles/apple-liquid.css) 的 `--lens-*` / `--pane-lens-*`。
   Safari / Firefox 不渲染 `backdrop-filter` 里引用的 SVG 滤镜，自动退到纯模糊；
   用户开「减少透明度」时退到不透明。


# registry

展示页和组件 registry 一起发在 GitHub Pages 上：

- 展示页 <https://createagle.github.io/apple-liquid/>
- registry `https://createagle.github.io/apple-liquid/r/<组件名>.json`

`pnpm build` = `shadcn build`（按 [registry.json](./registry.json) 生成 `public/r/*.json`）+
`next build`（静态导出到 `out/`，`public/` 会被原样拷进去）。`public/r` 不入库，由构建生成。
推到 `main` 就由 [pages.yml](./.github/workflows/pages.yml) 部署。

**基础 item `theme`** 把 [apple-liquid.css](./src/styles/apple-liquid.css) 原样装到对方项目的
`src/styles/apple-liquid.css`，并往对方的入口 CSS 里插一行 `@import "../styles/apple-liquid.css"`。
其他每个 item 都把它列进 `registryDependencies`，所以装任何一个组件都会带上全套 token。

**新增 / 改动组件时要同步改 [registry.json](./registry.json)**：

1. 新组件加一个 item，`name` 取文件名（目录式组件取目录名，如 `dialog`、`input`）。
2. `files`：组件自己的文件，外加同目录的 `*.content.ts`、`*.css` 等伴生文件。
   `target` 一律用别名形式（`@ui/`、`@components/`、`@lib/`、`@hooks/`），对方的
   `components.json` 里别名怎么配都能落对地方。目录式组件要把目录写进 target
   （`@ui/input/input.tsx`），否则会被拍平成 `@ui/input.tsx`，互相引用就断了。
3. `dependencies`：文件里 import 的 npm 包，带上 package.json 里的版本范围；
   子路径归到包名（`@base-ui/react/tabs` → `@base-ui/react`，`motion/react` → `motion`）；
   `react` / `react-dom` / `next` 不写。注意组件里的 `cn` 是直接从 npm 的 `cn` 包引的，
   不走 `@/lib/utils`，所以 registry 里没有 `utils` item，对方项目自己的 `lib/utils.ts` 不会被覆盖。
4. `registryDependencies`：文件里 `@/` 引用所属的 item，写完整 URL
   （`https://createagle.github.io/apple-liquid/r/<名字>.json`），再加上 `theme`。
   URL 形式是必须的：对方多半没在 `components.json` 里登记这个 registry，短名字解析不了。
5. 用到 `useIntlayer` 的组件（`dialog`、`input`、`field`、`color-picker`、`spinner`、
   `theme-toggle`、`site-preferences`）额外带 `intlayer` / `next-intlayer` 依赖和一段 `docs`：
   对方项目必须把 Intlayer 配齐（`intlayer.config.ts` + `withIntlayer` + `IntlayerProvider`），
   否则 `@intlayer/config` 会被打进浏览器包、构建直接失败。详见 [README](./README.md)。

改完跑 `pnpm registry` 看看能不能生成，再在一个干净项目里 `shadcn add` 验一下。

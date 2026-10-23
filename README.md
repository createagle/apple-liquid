# apple-liquid

从 [createagle-docs](../createagle-docs) 抽离出来的组件库：70 个 shadcn/ui 组件，按 Apple OS 27 的 Liquid Glass 设计语言重新设计，
支持明暗模式、10 种主色、三档玻璃通透度，以及 WebGL 粒子背景。

## 开始

```bash
pnpm install
pnpm dev
```

打开 http://localhost:3000 查看组件展示页。顶部「Appearance」可以切换主色、玻璃通透度和背景粒子，下面所有组件会跟着变化。

## 目录

- `src/components/ui/`：组件本体
- `src/app/globals.css`：设计 token（Apple 系统色、材质、字号、圆角）
- `src/components/theme-toggle`、`theme-provider.tsx`：明暗模式
- `src/components/site-preferences-*`、`src/lib/site-preferences.ts`：主色、玻璃通透度、粒子背景
- `src/components/particles.tsx`、`src/components/ui/background.tsx`：背景
- `src/app/(showcase)/`：展示页

## 在其他项目里使用

组件依赖 `globals.css` 里的 token，以及 `@/lib/utils`、`@/hooks/use-mobile` 等少量工具。
复制组件时一并带上这些文件，并在根布局里包上 `ThemeProvider`、`SitePreferencesProvider`、`TooltipProvider`、`Toaster`（参考 `src/app/layout.tsx`）。

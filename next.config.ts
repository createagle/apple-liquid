import type { NextConfig } from "next";
import { withIntlayer } from "next-intlayer/server";

/**
 * 展示页部署在 GitHub Pages：只能放静态文件，所以整站静态导出（out/）。
 *
 * Pages 把站点挂在仓库名的子路径下（/apple-liquid/），构建时用 NEXT_PUBLIC_BASE_PATH 传进来，
 * 见 .github/workflows/pages.yml；本地 dev / build 不设这个变量，站点就在根路径上。
 * 换自定义域名或改用 <user>.github.io 仓库时，把那个变量去掉即可。
 *
 * 静态导出下没有服务端：根布局不能再读 cookie / 请求头（见 src/app/layout.tsx），
 * 图片也没有按需优化的接口（images.unoptimized）。
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  ...(basePath && { basePath, assetPrefix: basePath }),
};

// 构建前把 *.content.ts 编译成字典（组件里的中英文文案）。
export default withIntlayer(nextConfig);

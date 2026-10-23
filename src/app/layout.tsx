import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getIntlayer } from "intlayer";
import { ThemeProvider } from "@/components/theme-provider";
import { Background } from "@/components/ui/background";
import { LocaleProvider } from "@/components/locale-provider";
import { SitePreferencesProvider } from "@/components/site-preferences-provider";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { faviconHref } from "@/lib/favicon";
import {
  DEFAULT_SITE_PREFERENCES,
  sitePreferenceVariables,
  sitePreferencesScript,
} from "@/lib/site-preferences";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * 展示页是静态导出（见 next.config.ts），服务端读不到 cookie 和请求头：
 * 元信息按默认语言出，标签页图标按默认主色出，之后由 SitePreferencesProvider 按 cookie 换掉。
 */
export const metadata: Metadata = {
  ...getIntlayer("root-layout").metadata,
  icons: {
    icon: { url: faviconHref(DEFAULT_SITE_PREFERENCES.primaryColor), type: "image/svg+xml" },
    apple: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/apple-icon.png`,
  },
};

/** iOS 的 maximum-scale 要看 UA，静态导出拿不到，改在 sitePreferencesScript 里按 navigator 判断。 */
export const viewport: Viewport = {};

/**
 * 外观偏好（主色、玻璃通透度）存在 cookie 里，HTML 带默认值，首次绘制前由 sitePreferencesScript
 * 按 cookie 改好 <html>，所以不闪。语言见 LocaleProvider。
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={sitePreferenceVariables(DEFAULT_SITE_PREFERENCES) as React.CSSProperties}
      data-glass={DEFAULT_SITE_PREFERENCES.glass}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: sitePreferencesScript() }} />
        <LocaleProvider>
          <SitePreferencesProvider>
            <ThemeProvider>
              {/* 全站背景：不要粒子，用大面积流动色晕，玻璃也才有东西可折射。 */}
              <Background variant="aurora" aria-hidden className="fixed inset-0 -z-10" />
              <TooltipProvider>
                <Toaster>{children}</Toaster>
              </TooltipProvider>
            </ThemeProvider>
          </SitePreferencesProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}

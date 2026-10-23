"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { useIntlayer } from "next-intlayer"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { ExpanderRow } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { changeThemeWithTransition } from "./transition"

const THEMES = [
  { value: "light", icon: SunIcon },
  { value: "dark", icon: MoonIcon },
  { value: "system", icon: MonitorIcon },
] as const

/**
 * 外观切换：浅色 / 深色 / 跟随系统。
 *
 * 两种样式：
 * - `dropdown`：一个图标按钮，点开是菜单，放在页面角落。按钮上的图标显示的是实际生效的
 *   那一套（选了「跟随系统」也会是太阳或月亮），菜单里勾选的是用户的选择。
 * - `expander`：折叠行，收起时一行显示「外观 + 当前选项」，点一下在原地展开三个选项。
 *   给账户菜单这类本身已经是浮层、不该再套一层弹层的地方用。
 */
function ThemeToggle({
  variant = "dropdown",
  className,
}: {
  variant?: "dropdown" | "expander"
  className?: string
}) {
  const { theme = "system", resolvedTheme, setTheme } = useTheme()
  const content = useIntlayer("theme-toggle")
  // `false` on the server, `true` once hydrated — without a setState-in-effect.
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  const isDark = resolvedTheme === "dark"

  if (variant === "expander") {
    return (
      <ExpanderRow
        className={className}
        label={content.label}
        // 没挂载完先当「跟随系统」，和服务端渲染出来的一致。
        value={mounted ? theme : "system"}
        onValueChange={(value, event) => {
          void changeThemeWithTransition(value, setTheme, event.nativeEvent)
        }}
        options={THEMES.map(({ value, icon }) => ({
          value,
          icon,
          label: content.options[value],
        }))}
      />
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="glass"
            size="icon"
            className={className}
            // Stable across SSR/hydration; the icon carries the state visually.
            aria-label={content.label.value}
          />
        }
      >
        {/* Render a stable placeholder until mounted so SSR and client match */}
        {mounted ? (
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={isDark ? "moon" : "sun"}
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
              className="flex items-center justify-center"
            >
              {isDark ? <MoonIcon /> : <SunIcon />}
            </motion.span>
          </AnimatePresence>
        ) : (
          <span className="size-4" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" title={content.label}>
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value, details) => {
            void changeThemeWithTransition(value, setTheme, details.event)
          }}
        >
          {THEMES.map(({ value, icon: Icon }) => (
            <DropdownMenuRadioItem key={value} value={value} closeOnClick>
              <Icon />
              {content.options[value]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ThemeToggle }

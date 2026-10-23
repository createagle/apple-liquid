"use client"

import { CheckIcon } from "lucide-react"
import { useIntlayer } from "next-intlayer"
import { cn } from "cn"

import { useSitePreferences } from "@/components/site-preferences-provider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  GLASS_LEVELS,
  PRIMARY_COLORS,
  primaryColorValue,
  primaryForegroundValue,
  type GlassLevel,
} from "@/lib/site-preferences"

/**
 * 网站外观设置：主色、玻璃通透度。前台「账户设置 → 外观设置」和后台「设置 → 外观设置」共用。
 * 偏好存在 cookie（见 SitePreferencesProvider），即时生效，不依赖用户资料或会员接口。
 */
export function SitePreferencesPanel() {
  const text = useIntlayer("site-preferences-panel")
  const { preferences, updatePreferences } = useSitePreferences()

  return (
    <div className="glass-card overflow-clip">
      <section className="p-6 max-sm:p-5" aria-labelledby="site-primary-title">
        <h2 id="site-primary-title" className="text-[20px] font-bold">{text.primaryTitle}</h2>
        <p className="mt-2 text-[15px] text-label-secondary">{text.primaryDescription}</p>
        <RadioGroup
          aria-labelledby="site-primary-title"
          value={preferences.primaryColor}
          onValueChange={(value) => {
            const color = PRIMARY_COLORS.find((color) => color === value)
            if (color) updatePreferences({ primaryColor: color })
          }}
          className="mt-5 grid-cols-5 gap-3 max-sm:gap-x-2 max-sm:gap-y-4"
        >
          {/* 桌面端是带单选框的色块卡片；手机上一行五个太挤，改成 iOS 那样只有色圆、选中加外圈。 */}
          {PRIMARY_COLORS.map((color) => {
            const checked = preferences.primaryColor === color
            return (
              <label
                key={color}
                className={cn(
                  "group/swatch relative flex cursor-pointer flex-col items-center gap-2 rounded-[14px] border border-separator/40 px-3 py-3.5 text-[13px] text-label-secondary transition-colors hover:bg-fill-tertiary",
                  "max-sm:border-transparent max-sm:px-0 max-sm:py-1 max-sm:hover:bg-transparent",
                  checked &&
                    "border-primary/60 bg-primary/6 font-semibold text-primary max-sm:bg-transparent max-sm:text-foreground",
                )}
              >
                <RadioGroupItem
                  value={color}
                  className="absolute top-2 right-2 size-3.5 max-sm:sr-only"
                  aria-label={text.colors[color].value}
                />
                <span
                  className={cn(
                    "mt-1 grid size-9 place-items-center rounded-full max-sm:mt-0 max-sm:size-10",
                    "max-sm:group-has-focus-visible/swatch:ring-[3px] max-sm:group-has-focus-visible/swatch:ring-ring/45",
                    checked && "max-sm:outline-2 max-sm:outline-offset-[3px]",
                  )}
                  style={{ backgroundColor: primaryColorValue(color), outlineColor: primaryColorValue(color) }}
                >
                  {checked && (
                    <CheckIcon aria-hidden className="size-4" style={{ color: primaryForegroundValue(color) }} />
                  )}
                </span>
                {text.colors[color]}
              </label>
            )
          })}
        </RadioGroup>
      </section>

      <section className="border-t border-separator/60 p-6 max-sm:p-5" aria-labelledby="site-glass-title">
        <h2 id="site-glass-title" className="text-[20px] font-bold">{text.glassTitle}</h2>
        <p className="mt-2 text-[15px] text-label-secondary">{text.glassDescription}</p>
        <RadioGroup
          aria-labelledby="site-glass-title"
          value={preferences.glass}
          onValueChange={(value) => {
            const level = GLASS_LEVELS.find((level) => level === value)
            if (level) updatePreferences({ glass: level })
          }}
          className="mt-5 grid-cols-3 gap-3 max-[560px]:grid-cols-1"
        >
          {GLASS_LEVELS.map((level) => (
            <label
              key={level}
              className="flex cursor-pointer flex-col gap-3 rounded-[14px] border border-separator/40 p-3 transition-colors hover:bg-fill-tertiary has-[[data-checked]]:border-primary/60 has-[[data-checked]]:bg-primary/6"
            >
              <GlassPreview level={level} />
              <span className="flex items-start gap-2.5 px-1 pb-1">
                <RadioGroupItem value={level} className="mt-0.5" />
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold">{text.glassLevels[level].title}</span>
                  <span className="mt-1 block text-[13px] leading-5 text-label-secondary">
                    {text.glassLevels[level].description}
                  </span>
                </span>
              </span>
            </label>
          ))}
        </RadioGroup>
        <p className="mt-5 text-[13px] text-label-tertiary">{text.savedHint}</p>
      </section>
    </div>
  )
}

/**
 * 某一档的效果预览：彩色底上放一条浮层玻璃和一张内容卡片。
 * 外层加 data-glass，只在这块区域里换成对应一档的底色，不影响页面其他部分。
 */
function GlassPreview({ level }: { level: GlassLevel }) {
  return (
    <span
      aria-hidden
      data-glass={level}
      className="relative block h-28 overflow-hidden rounded-[10px] bg-[linear-gradient(135deg,var(--apple-orange),var(--apple-pink)_45%,var(--primary))]"
    >
      <span className="absolute -top-3 right-2 text-[64px] leading-none font-black text-white/85 select-none">
        Aa
      </span>
      <span className="absolute -bottom-6 -left-4 size-20 rounded-full bg-apple-yellow/90" />
      <span className="glass absolute top-3 left-3 flex h-8 w-[62%] items-center gap-1.5 rounded-full px-2.5">
        <span className="size-3.5 rounded-full bg-primary" />
        <span className="h-1.5 w-10 rounded-full bg-foreground/45" />
      </span>
      <span className="glass-card absolute right-3 bottom-3 left-8 flex flex-col gap-1.5 rounded-[10px] p-2.5">
        <span className="h-1.5 w-3/4 rounded-full bg-foreground/50" />
        <span className="h-1.5 w-1/2 rounded-full bg-foreground/30" />
      </span>
    </span>
  )
}

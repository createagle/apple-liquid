import { cn } from "cn"

/**
 * 预览区的两种底：默认是不透明的卡片；`glass` 让页面背景的粒子和色晕透上来，
 * 给液态玻璃的控件（Tab 指示器、开关与滑块旋钮）留出可折射的内容。
 */
const SURFACES = {
  card: "bg-card shadow-[0_0_0_0.5px_var(--glass-hairline),0_1px_2px_rgba(0,0,0,0.03)]",
  glass: "glass-card",
} as const

/** One documented component: heading, Figma provenance, and a preview surface. */
function Section({
  id,
  title,
  figma,
  description,
  surface = "card",
  className,
  children,
}: {
  id: string
  title: string
  figma?: string
  description?: string
  surface?: keyof typeof SURFACES
  className?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-[22px] font-semibold tracking-tight">{title}</h2>
        {figma && (
          <span className="rounded-full bg-fill-tertiary px-2 py-0.5 text-[11px] text-label-secondary">
            {figma}
          </span>
        )}
      </div>
      {description && (
        <p className="mb-4 max-w-2xl text-[14px] text-label-secondary">
          {description}
        </p>
      )}
      <div
        className={cn(
          "flex min-h-32 flex-wrap items-center gap-4 rounded-[18px] p-6",
          SURFACES[surface],
          className
        )}
      >
        {children}
      </div>
    </section>
  )
}

export { Section }

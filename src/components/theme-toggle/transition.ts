import { flushSync } from "react-dom"

// 多个外观入口共用同一个过渡；连续选择时取消上一次，最后一次选择生效。
let activeTransition: ViewTransition | undefined
let latestRequest = 0

function transitionOrigin(event: Event) {
  if (event instanceof MouseEvent && event.detail > 0) {
    return { x: event.clientX, y: event.clientY }
  }

  // 键盘触发的 click 没有鼠标坐标，使用选项中心。
  const target = event.target instanceof Element
    ? event.target.closest("button, [role='menuitemradio']")
    : document.activeElement
  const rect = target?.getBoundingClientRect()
  return {
    x: rect ? rect.left + rect.width / 2 : innerWidth / 2,
    y: rect ? rect.top + rect.height / 2 : innerHeight / 2,
  }
}

export async function changeThemeWithTransition(
  theme: string,
  setTheme: (theme: string) => void,
  event: Event
) {
  const request = ++latestRequest
  const { x, y } = transitionOrigin(event)

  if (activeTransition) {
    activeTransition.skipTransition()
    await activeTransition.finished.catch(() => {})
    if (request !== latestRequest) return
  }

  const root = document.documentElement
  const nextTheme = theme === "system"
    ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : theme

  if (
    !document.startViewTransition ||
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    root.classList.contains("dark") === (nextTheme === "dark")
  ) {
    setTheme(theme)
    return
  }

  const radius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  )
  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${radius}px at ${x}px ${y}px)`,
  ]
  let transition: ViewTransition | undefined
  let animation: Animation | undefined

  try {
    // 快照前就排除路由专用的页头 / 标签栏拆分，让整页一起变色。
    root.dataset.themeTransition = nextTheme
    transition = document.startViewTransition(() => {
      // next-themes 在 effect 中更新 html，必须在新快照前提交状态和 effect。
      flushSync(() => setTheme(theme))
    })
    activeTransition = transition
    await transition.ready

    animation = root.animate(
      { clipPath: nextTheme === "dark" ? clipPath : [...clipPath].reverse() },
      {
        duration: 500,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        fill: "both",
        pseudoElement: nextTheme === "dark"
          ? "::view-transition-new(root)"
          : "::view-transition-old(root)",
      }
    )
  } catch {
    // 隐藏标签页、导航抢占或浏览器不支持伪元素动画时仍完成主题切换。
    if (transition) transition.skipTransition()
    else setTheme(theme)
  } finally {
    await transition?.finished.catch(() => {})
    // fill 保留结束帧直到快照移除，随后释放，避免影响下一轮同名伪元素。
    animation?.cancel()
    if (activeTransition === transition) {
      activeTransition = undefined
      delete root.dataset.themeTransition
    }
  }
}

const callbacks = new Map<Element, () => void>()
let observer: IntersectionObserver | undefined

/** 首次进入视野时执行一次；默认视口会同时考虑页面和内部滚动容器的裁剪。 */
export function observeOnceInView(element: Element, onVisible: () => void) {
  if (typeof IntersectionObserver === "undefined") {
    onVisible()
    return () => {}
  }
  observer ??= new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const callback = callbacks.get(entry.target)
      callbacks.delete(entry.target)
      observer?.unobserve(entry.target)
      callback?.()
    }
  })
  callbacks.set(element, onVisible)
  observer.observe(element)
  return () => {
    callbacks.delete(element)
    observer?.unobserve(element)
  }
}

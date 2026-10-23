/**
 * Base UI's `render` callback hands back plain React DOM props. A few of them
 * (`onDrag*`, `onAnimationStart`, …) collide with Motion's own props of the
 * same name, so they are stripped before the props reach a `motion.*` element.
 */
const CONFLICTING = [
  "onDrag",
  "onDragStart",
  "onDragEnd",
  "onDragEnter",
  "onDragExit",
  "onDragLeave",
  "onDragOver",
  "onDrop",
  "onAnimationStart",
  "onAnimationEnd",
  "onAnimationIteration",
] as const

function motionSafe<T extends object>(props: T) {
  const next = { ...props } as Record<string, unknown>
  for (const key of CONFLICTING) delete next[key]
  return next as Omit<T, (typeof CONFLICTING)[number]>
}

export { motionSafe }

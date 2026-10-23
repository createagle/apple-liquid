"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cn } from "cn"
import { useIntlayer } from "next-intlayer"

import { useIsMobile } from "@/hooks/use-mobile"

import { Button } from "@/components/ui/button"
import { Maximize2Icon, Minimize2Icon, XIcon } from "lucide-react"

const DialogFullscreenContext = React.createContext(false)
/** 切换全屏，参数是弹窗里的任意元素（用来找到弹窗做尺寸动画）；弹窗不允许全屏时为 null。 */
const DialogFullscreenToggleContext = React.createContext<((from: Element) => void) | null>(null)

function useDialogFullscreen() {
  return React.useContext(DialogFullscreenContext)
}

/** 在弹窗内容里自己放全屏入口时用，比如文件预览把它做成预览器工具栏上的按钮。 */
function useDialogFullscreenToggle() {
  return React.useContext(DialogFullscreenToggleContext)
}

/**
 * 全屏切换按钮。弹窗右上角默认就有一个；内容想把它放到别处时（比如文件预览放在工具栏旁），
 * 给 DialogContent 传 showFullscreenButton={false}，再在内容里放这个按钮。
 */
function DialogFullscreenButton({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "onClick" | "children">) {
  const content = useIntlayer("dialog")
  const fullscreen = useDialogFullscreen()
  const toggle = useDialogFullscreenToggle()
  if (!toggle) return null
  const label = fullscreen ? content.restore.value : content.fullscreen.value
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      title={label}
      aria-pressed={fullscreen}
      className={className}
      {...props}
      onClick={(event) => toggle(event.currentTarget)}
    >
      {fullscreen ? <Minimize2Icon /> : <Maximize2Icon />}
    </Button>
  )
}

/** Keep form ownership intact while separating fixed chrome from scrolling content. */
function layoutDialogChildren(children: React.ReactNode): React.ReactNode {
  const result: React.ReactNode[] = []
  let body: React.ReactNode[] = []
  const flush = () => {
    if (!body.length) return
    result.push(<DialogBody key={`body-${result.length}`}>{body}</DialogBody>)
    body = []
  }
  React.Children.toArray(children).forEach((child) => {
    if (React.isValidElement<{ children?: React.ReactNode; className?: string }>(child)) {
      if (child.type === React.Fragment) {
        // Fragments remain transparent to the layout.
        flush()
        result.push(<React.Fragment key={child.key}>{layoutDialogChildren(child.props.children)}</React.Fragment>)
        return
      }
      if (child.type === DialogHeader || child.type === DialogFooter || child.type === DialogBody) {
        flush()
        result.push(child)
        return
      }
      if (child.type === "form") {
        flush()
        result.push(React.cloneElement(child, {
          className: cn(child.props.className, "flex min-h-0 min-w-0 flex-1 flex-col gap-4 space-y-0"),
          children: layoutDialogChildren(child.props.children),
        }))
        return
      }
    }
    body.push(child)
  })
  flush()
  return result
}

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-glass-overlay duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function DialogContent(props: React.ComponentProps<typeof DialogContentPanel>) {
  // Portal unmounts its children after closing, resetting fullscreen for each opening.
  return <DialogPortal><DialogContentPanel {...props} /></DialogPortal>
}

function DialogContentPanel({
  className,
  children,
  showCloseButton = true,
  allowFullscreen = true,
  showFullscreenButton = true,
  style,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
  /** Show the fullscreen toggle. Dialogs still open at their normal size. */
  allowFullscreen?: boolean
  /** 允许全屏但不在右上角放按钮，由内容自己放 DialogFullscreenButton。 */
  showFullscreenButton?: boolean
}) {
  const content = useIntlayer("dialog")
  const [expanded, setExpanded] = React.useState(false)
  const fullscreen = allowFullscreen && expanded
  const resizeAnimation = React.useRef<Animation | null>(null)
  const resizeFrom = React.useRef<{
    element: HTMLElement
    width: number
    height: number
    radius: string
  } | null>(null)

  React.useLayoutEffect(() => {
    const from = resizeFrom.current
    resizeFrom.current = null
    if (!from) return
    const { element } = from
    const target = element.getBoundingClientRect()
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    // Animate measured dimensions, not position/scale: the center never changes,
    // text stays sharp, and an auto-height dialog can shrink back naturally.
    const animation = element.animate([
      { width: `${from.width}px`, height: `${from.height}px`, maxWidth: "none", maxHeight: "none", borderRadius: from.radius },
      { width: `${target.width}px`, height: `${target.height}px`, maxWidth: "none", maxHeight: "none", borderRadius: getComputedStyle(element).borderRadius },
    ], { duration: 300, easing: "cubic-bezier(0.32, 0.72, 0, 1)" })
    resizeAnimation.current = animation
    return () => {
      animation.cancel()
      if (resizeAnimation.current === animation) resizeAnimation.current = null
    }
  }, [fullscreen])

  const toggleFullscreen = (from: Element) => {
    const element = from.closest<HTMLElement>('[data-slot="dialog-content"]')
    if (element) {
      const rect = element.getBoundingClientRect()
      resizeFrom.current = { element, width: rect.width, height: rect.height, radius: getComputedStyle(element).borderRadius }
      // Capture the current interpolated size before reversing an unfinished transition.
      resizeAnimation.current?.cancel()
    }
    setExpanded((value) => !value)
  }

  return (
    <>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        data-fullscreen={fullscreen || undefined}
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-[22px] bg-popover p-5 text-[15px] text-popover-foreground shadow-[0_0_0_0.5px_var(--glass-hairline),0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-[28px] backdrop-saturate-150 duration-200 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          "max-h-[calc(100dvh-2rem)]",
          className,
          "flex flex-col overflow-hidden"
        )}
        {...props}
        style={{
          ...style,
          display: "flex",
          overflow: "hidden",
          ...(allowFullscreen && { transitionProperty: "none" }),
          ...(fullscreen && {
            top: "50%", left: "50%", right: "auto", bottom: "auto",
            width: "100%", height: "100dvh", maxWidth: "none", maxHeight: "100dvh",
            translate: "-50% -50%", borderRadius: 0,
          }),
        }}
      >
        <DialogFullscreenContext.Provider value={fullscreen}>
          <DialogFullscreenToggleContext.Provider value={allowFullscreen ? toggleFullscreen : null}>
            {layoutDialogChildren(children)}
            {(showFullscreenButton || showCloseButton) && (
              <div className="absolute top-4 right-4 flex items-center gap-1" data-slot="dialog-actions">
                {showFullscreenButton && <DialogFullscreenButton />}
                {showCloseButton && (
                  <DialogPrimitive.Close
                    data-slot="dialog-close"
                    render={<Button variant="ghost" size="icon-sm" />}
                  >
                    <XIcon />
                    <span className="sr-only">{content.close}</span>
                  </DialogPrimitive.Close>
                )}
              </div>
            )}
          </DialogFullscreenToggleContext.Provider>
        </DialogFullscreenContext.Provider>
      </DialogPrimitive.Popup>
    </>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex shrink-0 flex-col gap-2", className, "min-w-0 pr-16")}
      {...props}
    />
  )
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-body" className={cn("min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain space-y-4 -my-1 -ml-1 -mr-4 py-1 pl-1 pr-4", className)} {...props} />
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  const content = useIntlayer("dialog")

  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-5 -mb-5 mt-auto flex shrink-0 flex-col-reverse gap-2 rounded-b-[22px] border-t border-separator/30 bg-fill-tertiary/40 p-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          {content.close}
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-base leading-6 font-medium",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-[13px] text-label-secondary *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogBody,
  DialogFullscreenButton,
  useDialogFullscreen,
  useDialogFullscreenToggle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}

/** 悬浮信息在移动端使用点击式 Dialog，桌面仍由原组件管理悬浮状态。 */
function useMobileDialog({ open, defaultOpen = false, onOpenChange }: {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, ...args: never[]) => void
}) {
  const isMobile = useIsMobile()
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const triggerRef = React.useRef<HTMLElement | null>(null)
  const currentOpen = open ?? internalOpen
  const setOpen = React.useCallback((next: boolean) => {
    if (open === undefined) setInternalOpen(next)
    onOpenChange?.(next)
  }, [open, onOpenChange])
  const handleRootOpenChange = React.useCallback((next: boolean) => {
    if (!isMobile) setOpen(next)
  }, [isMobile, setOpen])
  const openFromTrigger = (event: React.MouseEvent<HTMLElement>) => {
    // 只有纯展示型触发器会走到这里，不拦默认行为，避免误挡链接跳转。
    triggerRef.current = event.currentTarget
    setOpen(true)
  }
  return { isMobile, open: currentOpen, setOpen, handleRootOpenChange, triggerRef, openFromTrigger }
}

function MobileInfoDialog({ open, onOpenChange, triggerRef, title, description, children, className }: {
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement | null>
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  const content = useIntlayer("dialog")
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent finalFocus={triggerRef} className="max-h-[80dvh] overflow-y-auto">
        <DialogHeader className={cn("pr-7", !title && !description && "sr-only")}>
          <DialogTitle className={title ? undefined : "sr-only"}>
            {title ?? content.details}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className={cn("min-w-0 whitespace-pre-wrap [overflow-wrap:anywhere]", className)}>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { MobileInfoDialog, useMobileDialog }

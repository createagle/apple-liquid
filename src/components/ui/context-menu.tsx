"use client"

import * as React from "react"
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu"
import { cn } from "cn"
import { useLiquidGlass } from "@/components/liquid-glass"

import {
  menuItem,
  menuItemHighlight,
  menuItemIndicated,
  menuItemIndicator,
  menuItemSelected,
  mobileSheetBackdrop,
  mobileSheetPopup,
  mobileSheetLabel,
  mobileSheetPositioner,
  MobileSheetHeader,
  MobileSubmenu,
  MobileSubmenuContent,
  MobileSubmenuTrigger,
  tapTrigger,
  useMobileSubmenu,
} from "@/components/ui/mobile-sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { ChevronRightIcon, CheckIcon } from "lucide-react"

function ContextMenu({ ...props }: ContextMenuPrimitive.Root.Props) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
}

function ContextMenuPortal({ ...props }: ContextMenuPrimitive.Portal.Props) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  )
}

function ContextMenuTrigger({
  className,
  onClick,
  ...props
}: ContextMenuPrimitive.Trigger.Props) {
  const isMobile = useIsMobile()

  return (
    <ContextMenuPrimitive.Trigger
      data-slot="context-menu-trigger"
      className={cn("select-none", tapTrigger, className)}
      onClick={(event) => {
        onClick?.(event)
        if (!isMobile) return
        // Base UI only opens this from a `contextmenu` event (right click) or a
        // long press. On touch we want a plain tap, so synthesise one at the
        // tap point — which also anchors the menu there.
        event.currentTarget.dispatchEvent(
          new MouseEvent("contextmenu", {
            bubbles: true,
            cancelable: true,
            clientX: event.clientX,
            clientY: event.clientY,
          })
        )
      }}
      {...props}
    />
  )
}

function ContextMenuContent({
  title,
  description,
  children,
  className,
  align = "start",
  alignOffset = 4,
  side = "right",
  sideOffset = 0,
  ...props
}: ContextMenuPrimitive.Popup.Props &
  Pick<
    ContextMenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  > & {
    /** Centred header, rendered only when the menu becomes a bottom sheet. */
    title?: React.ReactNode
    description?: React.ReactNode
  }) {
  // 导航层的浮层：常驻玻璃，折射集中在圆角那一圈（AGENTS.md 第 6 条）。
  const glass = useLiquidGlass<HTMLDivElement>({ material: "pane" })

  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Backdrop className={mobileSheetBackdrop} />
      <ContextMenuPrimitive.Positioner
        className={cn("isolate z-50 outline-none", mobileSheetPositioner)}
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <ContextMenuPrimitive.Popup
          data-slot="context-menu-content"
          {...glass.surface}
          className={cn(
            "glass z-50 max-h-(--available-height) min-w-44 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-[14px] p-1 text-popover-foreground duration-150 outline-none",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1",
            mobileSheetPopup,
            className
          )}
          {...props}
          style={{ ...glass.surface.style, ...props.style }}
        >
          {glass.filter}
          <MobileSheetHeader title={title} description={description} />
          {children}
        </ContextMenuPrimitive.Popup>
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  )
}

function ContextMenuGroup({ ...props }: ContextMenuPrimitive.Group.Props) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  )
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: ContextMenuPrimitive.GroupLabel.Props & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.GroupLabel
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        mobileSheetLabel,
        "data-inset:pl-7",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: ContextMenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        menuItem,
        menuItemHighlight,
        "group/context-menu-item data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-40",
        "data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20",
        className
      )}
      {...props}
    />
  )
}

/** 移动端在当前底部抽屉里原地展开，见 `MobileSubmenu`。 */
function ContextMenuSub({ ...props }: ContextMenuPrimitive.SubmenuRoot.Props) {
  const isMobile = useIsMobile()
  if (isMobile) {
    return (
      <MobileSubmenu defaultOpen={props.defaultOpen}>{props.children}</MobileSubmenu>
    )
  }
  return (
    <ContextMenuPrimitive.SubmenuRoot data-slot="context-menu-sub" {...props} />
  )
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: ContextMenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}) {
  const mobileSubmenu = useMobileSubmenu()
  if (mobileSubmenu) {
    return (
      <MobileSubmenuTrigger
        data-slot="context-menu-sub-trigger"
        data-inset={inset}
        disabled={props.disabled}
        className={cn(
          menuItem,
          menuItemHighlight,
          "data-inset:pl-7",
          typeof className === "string" && className
        )}
      >
        {children}
      </MobileSubmenuTrigger>
    )
  }
  return (
    <ContextMenuPrimitive.SubmenuTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        menuItem,
        menuItemHighlight,
        "data-inset:pl-7 data-open:bg-fill-tertiary",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </ContextMenuPrimitive.SubmenuTrigger>
  )
}

function ContextMenuSubContent({
  ...props
}: React.ComponentProps<typeof ContextMenuContent>) {
  const mobileSubmenu = useMobileSubmenu()
  if (mobileSubmenu) {
    return <MobileSubmenuContent>{props.children}</MobileSubmenuContent>
  }
  return (
    <ContextMenuContent
      data-slot="context-menu-sub-content"
      className="shadow-lg"
      side="right"
      {...props}
    />
  )
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: ContextMenuPrimitive.CheckboxItem.Props & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        menuItem,
        menuItemHighlight,
        menuItemIndicated,
        "data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-40",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className={cn(menuItemIndicator, "text-primary")}>
        <ContextMenuPrimitive.CheckboxItemIndicator>
          <CheckIcon
          />
        </ContextMenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  )
}

function ContextMenuRadioGroup({
  ...props
}: ContextMenuPrimitive.RadioGroup.Props) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  )
}

function ContextMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: ContextMenuPrimitive.RadioItem.Props & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      data-inset={inset}
      className={cn(
        menuItem,
        menuItemHighlight,
        menuItemSelected,
        menuItemIndicated,
        "data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-40",
        className
      )}
      {...props}
    >
      <span className={menuItemIndicator}>
        <ContextMenuPrimitive.RadioItemIndicator>
          <CheckIcon
          />
        </ContextMenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  )
}

function ContextMenuSeparator({
  className,
  ...props
}: ContextMenuPrimitive.Separator.Props) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-separator/40", className)}
      {...props}
    />
  )
}

function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-focus/context-menu-item:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}

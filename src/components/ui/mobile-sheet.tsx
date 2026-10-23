"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { cn } from "cn"
import { ChevronRightIcon } from "lucide-react"

/**
 * Apple OS 27 treats every transient surface on a phone as a sheet that rises
 * from the bottom edge — never a popover anchored to the trigger. These class
 * strings pin a Base UI Positioner/Popup pair to the bottom of the viewport
 * below the `md` breakpoint while leaving desktop anchoring untouched.
 *
 * Floating UI writes `position`/`top`/`left`/`transform` as inline styles on
 * the positioner, so the mobile overrides have to be `!important` to win.
 */
const mobileSheetPositioner = [
  "max-md:!fixed",
  "max-md:!inset-x-0",
  "max-md:!bottom-0",
  "max-md:!top-auto",
  "max-md:!left-0",
  "max-md:!right-0",
  "max-md:!w-full",
  "max-md:!min-w-0",
  "max-md:!max-w-none",
  "max-md:!transform-none",
  "max-md:!p-0",
].join(" ")

const mobileSheetPopup = [
  "max-md:w-full",
  "max-md:max-w-none",
  "max-md:min-w-0",
  "max-md:rounded-t-[26px]",
  "max-md:rounded-b-none",
  "max-md:border-0",
  "max-md:pb-[max(env(safe-area-inset-bottom),1rem)]",
  "max-md:pt-2.5",
  "max-md:max-h-[72dvh]",
  // 统一的抽屉玻璃，覆盖桌面浮层的 glass 和调用方传入的背景色，见 globals.css。
  "max-md:glass-sheet",
  // Rise from the bottom instead of scaling out of the trigger.
  "max-md:data-open:animate-none",
  "max-md:data-closed:animate-none",
  "max-md:data-starting-style:translate-y-full",
  "max-md:data-ending-style:translate-y-full",
  "max-md:transition-transform",
  "max-md:duration-[420ms]",
  "max-md:ease-[cubic-bezier(0.32,0.72,0,1)]",
  // The iOS grabber, drawn as a pseudo-element so it works on popups that
  // render their children straight from `...props`.
  "max-md:before:mx-auto max-md:before:mb-2 max-md:before:block max-md:before:h-1 max-md:before:w-9 max-md:before:rounded-full max-md:before:bg-label-tertiary max-md:before:content-['']",
].join(" ")

/** 抽屉背后的遮罩；Drawer 组件的遮罩用同一套数值。 */
const mobileSheetBackdrop =
  "max-md:fixed max-md:inset-0 max-md:z-40 max-md:bg-sheet-overlay max-md:backdrop-blur-[2px] max-md:transition-opacity max-md:duration-300 max-md:data-starting-style:opacity-0 max-md:data-ending-style:opacity-0 md:hidden"

/**
 * Shared row shape for every menu/picker surface. 底部抽屉里行高 44px（iOS 最小触控
 * 高度），其余间距与桌面一致；桌面不变。颜色不在这里，见 `menuItemHighlight` 和
 * `menuItemSelected`。
 */
const mobileSheetItem = "rounded-[10px] max-md:min-h-11"

/**
 * 一行选项的样式，Select、下拉菜单、右键菜单、命令面板共用一份：间距、字号一致。
 * 颜色另外拼：`menuItemHighlight` / `menuItemHoverable` 管划过，`menuItemSelected`
 * 管选中。禁用态也不在这里——各家写 disabled 的属性不一样（cmdk 连没禁用也会写
 * data-disabled="false"），留给组件自己声明。
 *
 * 以前每个组件各抄一份，菜单里的单选/多选项一直停在 shadcn 的默认值上
 * （14px、py-1、灰底高亮），和 Select 的行对不上。
 */
const menuItem = [
  mobileSheetItem,
  "relative flex cursor-default items-center gap-1.5 px-2.5 py-1.5 text-[15px] outline-hidden select-none",
  "transition-colors duration-150",
  // 行之间留一点缝：选中的蓝底和划过的灰底挨在一起时，中间得有条空隙。
  "mb-0.5 last:mb-0",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
].join(" ")

/** 行右边要放勾选标记时，给它留出位置。 */
const menuItemIndicated = "pr-8"

/**
 * 划过 / 键盘走到的那一行：灰底，和侧边栏一样。用在 Select、菜单这些由库标
 * `data-highlighted` 的行上。
 */
const menuItemHighlight =
  "focus:bg-fill-tertiary data-highlighted:bg-fill-tertiary"

/** 自己搭的行（树、折叠行）没有 `data-highlighted`，hover 得自己写。 */
const menuItemHoverable = "group/menu-row hover:bg-fill-tertiary"

/**
 * 单选选中的那一行：蓝底白字。多选不使用此样式，见 `menuItemMultiSelected`。
 *
 * 各家标选中的属性不一样：Select、树、折叠行是 `data-selected`，菜单的单选项
 * 是 `data-checked`，两个都认。
 *
 * 写 `data-[selected]` 而不是 `data-selected`：后者 Tailwind 会编成
 * `[data-selected="true"]`（迁就 cmdk 那种写 "true"/"false" 的库），而 Base UI
 * 写的是空值属性，配不上。`data-checked` 编出来是「有这个属性且不为 false」，
 * 空值能配上，照常写。
 *
 * `!` 是因为选中要压过划过的灰底，不然谁赢取决于 Tailwind 把哪条排在后面。
 * `**:` 是「行里所有图标」，不只直接子元素——树的图标裹在标签 span 里。
 */
const menuItemSelected = [
  "data-[selected]:bg-primary! data-[selected]:text-primary-foreground! data-[selected]:**:[svg]:text-primary-foreground!",
  "data-checked:bg-primary! data-checked:text-primary-foreground! data-checked:**:[svg]:text-primary-foreground!",
].join(" ")

/**
 * 多选选中的那一行：文字用主题色，不铺底色，勾选图标由调用方设为主题色。
 * `data-[selected]` 的写法原因同上。
 */
const menuItemMultiSelected = "data-[selected]:text-primary"

/** 勾选标记的位置；单选继承行颜色，多选由调用方使用 primary 图标色。 */
const menuItemIndicator =
  "pointer-events-none absolute right-2 flex size-4 items-center justify-center"

/** Group labels start on the same x as the row text (item px-2.5). */
const mobileSheetLabel =
  "px-2.5 py-1 text-[12px] font-medium text-label-tertiary"

/**
 * The header every bottom sheet shares: a centred title with an optional
 * description, mirroring the nav drawer. Sheet-only — desktop popovers keep
 * their own anchored layout.
 */
function MobileSheetHeader({
  title,
  description,
}: {
  title?: React.ReactNode
  description?: React.ReactNode
}) {
  if (!title && !description) return null

  return (
    <div className="hidden flex-col gap-0.5 px-4 pt-1 pb-3 text-center max-md:flex">
      {title && (
        <p className="font-heading text-base font-medium text-foreground">
          {title}
        </p>
      )}
      {description && (
        <p className="text-[13px] text-label-secondary">{description}</p>
      )}
    </div>
  )
}

/**
 * 底部抽屉里的二级菜单：不再叠一层抽屉，而是在当前抽屉里原地展开。
 * 下拉菜单、右键菜单、菜单栏的 `*Sub` 在移动端换成这三件，桌面仍用 Base UI 的
 * 侧弹子菜单。触发行是普通菜单项（点了不关菜单），子项仍挂在父菜单上，
 * 点子项照常关闭整个菜单。
 */
const MobileSubmenuContext = React.createContext<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  contentId: string
} | null>(null)

function MobileSubmenu({
  defaultOpen = false,
  children,
}: {
  defaultOpen?: boolean
  children?: React.ReactNode
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  const contentId = React.useId()
  const value = React.useMemo(
    () => ({ open, setOpen, contentId }),
    [open, contentId]
  )

  return (
    <MobileSubmenuContext.Provider value={value}>
      {children}
    </MobileSubmenuContext.Provider>
  )
}

/** 在移动端二级菜单内时返回展开状态，否则为 `null`（走桌面子菜单）。 */
function useMobileSubmenu() {
  return React.useContext(MobileSubmenuContext)
}

function MobileSubmenuTrigger({
  className,
  disabled,
  children,
  ...props
}: {
  className?: string
  disabled?: boolean
  children?: React.ReactNode
  "data-slot"?: string
  "data-inset"?: boolean
}) {
  const submenu = useMobileSubmenu()
  if (!submenu) return null
  const { open, setOpen, contentId } = submenu

  return (
    <MenuPrimitive.Item
      closeOnClick={false}
      disabled={disabled}
      aria-expanded={open}
      aria-controls={contentId}
      className={cn(className, "data-disabled:pointer-events-none data-disabled:opacity-40")}
      onClick={() => setOpen((value) => !value)}
      {...props}
    >
      {children}
      <ChevronRightIcon
        className={cn(
          "ml-auto transition-transform duration-200 ease-apple",
          open && "rotate-90"
        )}
      />
    </MenuPrimitive.Item>
  )
}

/**
 * 收起时保留在 DOM 里并设为 `inert`，高度用 grid 行从 0fr 过渡到 1fr。
 * 子项左侧缩进到与触发行文字对齐（行内边距 10px + 图标 16px + 间距 6px）。
 */
function MobileSubmenuContent({ children }: { children?: React.ReactNode }) {
  const submenu = useMobileSubmenu()
  if (!submenu) return null
  const { open, contentId } = submenu

  return (
    <div
      id={contentId}
      role="group"
      inert={!open}
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-300 ease-apple",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
    >
      <div className="min-h-0 overflow-hidden pl-[22px]">{children}</div>
    </div>
  )
}

/** Removes the tap delay some mobile browsers still apply. */
const tapTrigger = "max-md:[touch-action:manipulation]"

export {
  menuItem,
  menuItemHighlight,
  menuItemHoverable,
  menuItemIndicated,
  menuItemIndicator,
  menuItemMultiSelected,
  menuItemSelected,
  mobileSheetBackdrop,
  mobileSheetItem,
  mobileSheetLabel,
  mobileSheetPopup,
  mobileSheetPositioner,
  MobileSheetHeader,
  MobileSubmenu,
  MobileSubmenuContent,
  MobileSubmenuTrigger,
  tapTrigger,
  useMobileSubmenu,
}

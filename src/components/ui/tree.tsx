"use client"

import * as React from "react"
import { cn } from "cn"
import { CheckIcon, ChevronDownIcon, ChevronRightIcon, XIcon } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import {
  menuItem,
  menuItemHoverable,
  menuItemIndicated,
  menuItemIndicator,
  menuItemSelected,
  MobileSheetHeader,
} from "@/components/ui/mobile-sheet"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { selectTrigger, selectTriggerIcon } from "@/components/ui/select"
import { useIsMobile } from "@/hooks/use-mobile"

/* -------------------------------- Tree -------------------------------- */

type TreeNodeMeta<T> = {
  id: string
  node: T
  parentId: string | null
  childrenIds: string[]
  disabled: boolean
}

export interface TreeProps<T> {
  data: T[]
  /** 节点 id，默认取 node.id */
  getId?: (node: T) => string
  /** 子节点，默认取 node.children */
  getChildren?: (node: T) => T[] | undefined
  getDisabled?: (node: T) => boolean
  /** 单选模式下能不能选中；不能选的节点点击时只切换展开。默认都能选。 */
  getSelectable?: (node: T) => boolean
  /** 节点内容，默认取 node.label ?? node.name ?? id */
  renderLabel?: (node: T) => React.ReactNode
  /** 展开的节点（受控） */
  expandedIds?: string[]
  /** 默认展开的节点，"all" 表示全部展开（默认） */
  defaultExpandedIds?: string[] | "all"
  onExpandedChange?: (ids: string[]) => void
  /** 单选选中的节点（受控） */
  selectedId?: string | null
  defaultSelectedId?: string | null
  onSelect?: (id: string, node: T) => void
  /**
   * 选中的行右边显示勾，默认显示（下拉选择里要靠它看出选了哪个）。
   * 选中行已经整行高亮、不需要再打勾的场景（比如左侧导航树）传 false。
   */
  showSelectedCheck?: boolean
  /** 开启勾选（多选） */
  checkable?: boolean
  /** 勾选的节点（受控）。只含「全选」的节点，半选由组件自己推出来。 */
  checkedIds?: string[]
  defaultCheckedIds?: string[]
  onCheckedChange?: (ids: string[]) => void
  /** 父子勾选不联动。默认联动：勾父级带上全部子级，子级全勾上父级跟着勾上。 */
  checkStrictly?: boolean
  className?: string
}

function useControllableState<V>(
  value: V | undefined,
  defaultValue: V,
  onChange?: (value: V) => void
) {
  const [internal, setInternal] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const state = isControlled ? value : internal
  const setState = (next: V) => {
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }
  return [state, setState] as const
}

const defaultGetId = (node: unknown) =>
  String((node as { id: string | number }).id)
const defaultGetChildren = (node: unknown) =>
  (node as { children?: unknown[] }).children
const defaultRenderLabel = (node: unknown) => {
  const record = node as { label?: React.ReactNode; name?: React.ReactNode }
  return record.label ?? record.name ?? defaultGetId(node)
}

/**
 * 树：可展开收起，支持单选（点行选中）和勾选（多选、父子联动、半选）。
 * 键盘：上下移动焦点，左右收起 / 展开，回车或空格选中 / 勾选。
 */
function Tree<T>({
  data,
  getId = defaultGetId,
  getChildren = defaultGetChildren as (node: T) => T[] | undefined,
  getDisabled,
  getSelectable,
  renderLabel = defaultRenderLabel,
  expandedIds,
  defaultExpandedIds = "all",
  onExpandedChange,
  selectedId,
  defaultSelectedId,
  onSelect,
  showSelectedCheck = true,
  checkable = false,
  checkedIds,
  defaultCheckedIds,
  onCheckedChange,
  checkStrictly = false,
  className,
}: TreeProps<T>) {
  const rootRef = React.useRef<HTMLUListElement>(null)

  // 拍平成 id → 元信息，级联勾选、推半选、展开都要查。
  const metaMap = React.useMemo(() => {
    const map = new Map<string, TreeNodeMeta<T>>()
    const walk = (nodes: T[], parentId: string | null) => {
      nodes.forEach((node) => {
        const id = getId(node)
        const children = getChildren(node) ?? []
        map.set(id, {
          id,
          node,
          parentId,
          childrenIds: children.map(getId),
          disabled: getDisabled?.(node) ?? false,
        })
        walk(children, id)
      })
    }
    walk(data, null)
    return map
  }, [data, getId, getChildren, getDisabled])

  const allExpandableIds = React.useMemo(
    () =>
      [...metaMap.values()]
        .filter((meta) => meta.childrenIds.length > 0)
        .map((meta) => meta.id),
    [metaMap]
  )
  const expandable = allExpandableIds.length > 0

  // 内部展开状态允许 "all"：数据是异步来的，也能保持「默认全部展开」。
  // 往外回调时只会是数组。
  const [expandedState, setExpandedState] = useControllableState<
    string[] | "all"
  >(
    expandedIds,
    defaultExpandedIds,
    onExpandedChange as ((ids: string[] | "all") => void) | undefined
  )
  const isExpanded = (id: string) =>
    expandedState === "all"
      ? (metaMap.get(id)?.childrenIds.length ?? 0) > 0
      : expandedState.includes(id)
  const toggleExpand = (id: string) => {
    const current = expandedState === "all" ? allExpandableIds : expandedState
    setExpandedState(
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    )
  }

  const [selected, setSelected] = useControllableState<string | null>(
    selectedId,
    defaultSelectedId ?? null
  )
  const selectionEnabled =
    selectedId !== undefined || defaultSelectedId !== undefined || !!onSelect

  const [checked, setChecked] = useControllableState<string[]>(
    checkedIds,
    defaultCheckedIds ?? [],
    onCheckedChange
  )
  const checkedSet = React.useMemo(() => new Set(checked), [checked])

  // 半选：自己没勾，但有勾上的后代。
  const indeterminateSet = React.useMemo(() => {
    const result = new Set<string>()
    if (checkStrictly) return result
    checkedSet.forEach((id) => {
      let parentId = metaMap.get(id)?.parentId ?? null
      while (parentId) {
        if (!checkedSet.has(parentId)) result.add(parentId)
        parentId = metaMap.get(parentId)?.parentId ?? null
      }
    })
    return result
  }, [checkedSet, metaMap, checkStrictly])

  const descendantsOf = (id: string): string[] =>
    (metaMap.get(id)?.childrenIds ?? []).flatMap((childId) => [
      childId,
      ...descendantsOf(childId),
    ])

  const toggleCheck = (id: string) => {
    const set = new Set(checkedSet)
    const nextChecked = !set.has(id)
    if (checkStrictly) {
      if (nextChecked) set.add(id)
      else set.delete(id)
    } else {
      // 先带上所有后代（跳过禁用的），再自下而上同步祖先的全选状态。
      const cascadeIds = [
        id,
        ...descendantsOf(id).filter((item) => !metaMap.get(item)?.disabled),
      ]
      cascadeIds.forEach((item) => {
        if (nextChecked) set.add(item)
        else set.delete(item)
      })
      let parentId = metaMap.get(id)?.parentId ?? null
      while (parentId) {
        const parent = metaMap.get(parentId)
        if (!parent) break
        const allChildrenChecked =
          parent.childrenIds.length > 0 &&
          parent.childrenIds.every((childId) => set.has(childId))
        if (allChildrenChecked) set.add(parentId)
        else set.delete(parentId)
        parentId = parent.parentId
      }
    }
    setChecked([...set])
  }

  const activateRow = (id: string, node: T) => {
    if (checkable) {
      toggleCheck(id)
      return
    }
    if (selectionEnabled && (getSelectable?.(node) ?? true)) {
      setSelected(id)
      onSelect?.(id, node)
      return
    }
    if ((metaMap.get(id)?.childrenIds.length ?? 0) > 0) toggleExpand(id)
  }

  const onRowKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    id: string,
    node: T
  ) => {
    const hasChildren = (metaMap.get(id)?.childrenIds.length ?? 0) > 0
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault()
        const rows = Array.from(
          rootRef.current?.querySelectorAll<HTMLElement>(
            '[data-slot="tree-row"]:not([data-disabled])'
          ) ?? []
        )
        const index = rows.indexOf(event.currentTarget)
        rows[index + (event.key === "ArrowDown" ? 1 : -1)]?.focus()
        break
      }
      case "ArrowRight":
        if (hasChildren && !isExpanded(id)) {
          event.preventDefault()
          toggleExpand(id)
        }
        break
      case "ArrowLeft":
        if (hasChildren && isExpanded(id)) {
          event.preventDefault()
          toggleExpand(id)
        }
        break
      case "Enter":
      case " ":
        event.preventDefault()
        activateRow(id, node)
        break
    }
  }

  const renderNodes = (nodes: T[], depth: number): React.ReactNode =>
    nodes.map((node, index) => {
      const id = getId(node)
      const children = getChildren(node) ?? []
      const hasChildren = children.length > 0
      const expanded = isExpanded(id)
      const disabled = getDisabled?.(node) ?? false
      const isSelected = selectionEnabled && selected === id
      const isChecked = checkedSet.has(id)
      const isIndeterminate = !isChecked && indeterminateSet.has(id)

      return (
        <li key={id} role="none">
          <div
            data-slot="tree-row"
            role="treeitem"
            aria-level={depth + 1}
            aria-expanded={hasChildren ? expanded : undefined}
            aria-selected={selectionEnabled ? isSelected : undefined}
            aria-checked={
              checkable ? (isIndeterminate ? "mixed" : isChecked) : undefined
            }
            aria-disabled={disabled || undefined}
            data-selected={isSelected || undefined}
            data-disabled={disabled || undefined}
            tabIndex={depth === 0 && index === 0 ? 0 : -1}
            className={cn(
              menuItem,
              menuItemHoverable,
              menuItemSelected,
              // 选中的行右边有个勾，只给这一行留位置；没勾的行不占这块宽度。
              isSelected && showSelectedCheck && menuItemIndicated,
              "focus-visible:ring-[3px] focus-visible:ring-ring/45",
              "data-disabled:pointer-events-none data-disabled:opacity-40"
            )}
            onClick={() => activateRow(id, node)}
            onKeyDown={(event) => onRowKeyDown(event, id, node)}
          >
            {/* 顶层不缩进：别渲染 0 宽的占位，不然它还要多占一份 gap。
                每层缩进 18px，其中 6px 是 gap 给的。 */}
            {depth > 0 && (
              <span
                aria-hidden
                className="shrink-0"
                style={{ width: depth * 18 - 6 }}
              />
            )}
            {/* 整棵树都没有能展开的节点（平铺的列表）就不留箭头列；
                有的话叶子节点也留着，名称才和有箭头的兄弟对齐。 */}
            {expandable && (
              <span
                aria-hidden
                className="flex size-5 shrink-0 items-center justify-center rounded-full text-label-tertiary transition-colors hover:bg-fill-secondary hover:text-foreground"
                onClick={(event) => {
                  if (!hasChildren) return
                  event.stopPropagation()
                  toggleExpand(id)
                }}
              >
                {hasChildren && (
                  <ChevronRightIcon
                    className={cn(
                      "size-4 transition-transform duration-200 ease-apple",
                      expanded && "rotate-90"
                    )}
                  />
                )}
              </span>
            )}
            {checkable && (
              <span
                className="flex shrink-0 items-center"
                onClick={(event) => event.stopPropagation()}
              >
                <Checkbox
                  checked={isChecked}
                  indeterminate={isIndeterminate}
                  disabled={disabled}
                  tabIndex={-1}
                  onCheckedChange={() => toggleCheck(id)}
                />
              </span>
            )}
            <span className="min-w-0 flex-1 truncate">{renderLabel(node)}</span>
            {isSelected && showSelectedCheck && (
              <span className={menuItemIndicator}>
                <CheckIcon />
              </span>
            )}
          </div>
          {hasChildren && expanded && (
            <ul role="group" className="mt-0.5 flex flex-col gap-0.5">
              {renderNodes(children, depth + 1)}
            </ul>
          )}
        </li>
      )
    })

  return (
    <ul
      ref={rootRef}
      role="tree"
      aria-multiselectable={checkable || undefined}
      data-slot="tree"
      className={cn("flex flex-col gap-0.5", className)}
    >
      {renderNodes(data, 0)}
    </ul>
  )
}

/* ----------------------------- TreeSelect ----------------------------- */

export interface TreeSelectProps<T>
  extends Pick<
    TreeProps<T>,
    | "data"
    | "getId"
    | "getChildren"
    | "getDisabled"
    | "getSelectable"
    | "renderLabel"
    | "defaultExpandedIds"
  > {
  /** 选中节点的 id，空表示没选 */
  value?: string | null
  /** 选中回传 id，清空回传 null */
  onValueChange?: (value: string | null) => void
  /** 没选时触发器上的文字，写成「请选择父分类」；也是移动端底部抽屉的说明 */
  placeholder?: React.ReactNode
  /** 移动端底部抽屉的标题，传字段的 label */
  title?: React.ReactNode
  /** data 为空时显示 */
  emptyText?: React.ReactNode
  allowClear?: boolean
  disabled?: boolean
  id?: string
  className?: string
  onBlur?: React.FocusEventHandler<HTMLButtonElement>
}

/** 从树里选一个节点的下拉框，外观和 Select 一致。 */
function TreeSelect<T>({
  data,
  getId = defaultGetId,
  getChildren = defaultGetChildren as (node: T) => T[] | undefined,
  getDisabled,
  getSelectable,
  renderLabel = defaultRenderLabel,
  defaultExpandedIds = "all",
  value,
  onValueChange,
  placeholder,
  title,
  emptyText,
  allowClear = false,
  disabled = false,
  id,
  className,
  onBlur,
}: TreeSelectProps<T>) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)

  const selectedNode = React.useMemo(() => {
    if (!value) return undefined
    const find = (nodes: T[]): T | undefined => {
      for (const node of nodes) {
        if (getId(node) === value) return node
        const found = find(getChildren(node) ?? [])
        if (found) return found
      }
      return undefined
    }
    return find(data)
  }, [data, value, getId, getChildren])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            id={id}
            disabled={disabled}
            data-slot="tree-select-trigger"
            data-placeholder={!selectedNode || undefined}
            onBlur={onBlur}
            // 和 SelectTrigger 同一套外观。
            className={cn(
              selectTrigger,
              className
            )}
          />
        }
      >
        <span className="flex min-w-0 flex-1 items-center gap-1.5 truncate text-start">
          {selectedNode ? renderLabel(selectedNode) : placeholder}
        </span>
        <span className="flex shrink-0 items-center gap-1">
          {allowClear && selectedNode && !disabled && (
            <span
              role="button"
              tabIndex={-1}
              aria-hidden
              className="flex size-4 items-center justify-center rounded-full text-label-tertiary transition-colors hover:text-foreground"
              onPointerDown={(event) => {
                event.stopPropagation()
                event.preventDefault()
              }}
              onClick={(event) => {
                event.stopPropagation()
                onValueChange?.(null)
              }}
            >
              <XIcon className="size-3.5" />
            </span>
          )}
          <ChevronDownIcon className={selectTriggerIcon} />
        </span>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-(--anchor-width) min-w-56 gap-0 p-1"
      >
        <MobileSheetHeader title={title} description={placeholder} />
        <div
          className={cn(
            "overflow-x-hidden overflow-y-auto",
            isMobile ? "max-h-[calc(70dvh-60px)]" : "max-h-72"
          )}
        >
          {data.length > 0 ? (
            <Tree
              data={data}
              getId={getId}
              getChildren={getChildren}
              getDisabled={getDisabled}
              getSelectable={getSelectable}
              renderLabel={renderLabel}
              defaultExpandedIds={defaultExpandedIds}
              selectedId={value || null}
              onSelect={(nextId) => {
                onValueChange?.(nextId)
                setOpen(false)
              }}
            />
          ) : (
            <div className="py-6 text-center text-[13px] text-label-secondary">
              {emptyText}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { Tree, TreeSelect }

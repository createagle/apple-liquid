/** Section registry shared by the sidebar nav and the page itself. */
export type Section = { id: string; title: string; figma?: string }
export type SectionGroup = { label: string; items: Section[] }

export const SECTION_GROUPS: SectionGroup[] = [
  {
    label: "Foundations",
    items: [
      { id: "install", title: "Install", figma: "shadcn registry" },
      { id: "appearance", title: "Appearance", figma: "Site preferences" },
      { id: "colors", title: "Colors", figma: "Colors" },
      { id: "materials", title: "Materials", figma: "Materials" },
      { id: "glass-surface", title: "Glass Surface", figma: "React Bits" },
      { id: "typography", title: "Typography", figma: "Text Styles" },
    ],
  },
  {
    label: "Controls",
    items: [
      { id: "button", title: "Button", figma: "iOS · Buttons" },
      { id: "toggle", title: "Toggle", figma: "macOS · Buttons" },
      { id: "switch", title: "Switch", figma: "iOS · Toggles" },
      { id: "checkbox", title: "Checkbox", figma: "macOS · Toggles" },
      { id: "radio-group", title: "Radio Group", figma: "macOS · Toggles" },
      { id: "slider", title: "Slider", figma: "iOS · Sliders" },
      { id: "segmented", title: "Segmented Control", figma: "iOS · Segmented Controls" },
      { id: "progress", title: "Progress", figma: "iOS · Progress Indicators" },
    ],
  },
  {
    label: "Text entry",
    items: [
      { id: "input", title: "Input", figma: "iOS · Text Fields" },
      { id: "textarea", title: "Textarea", figma: "macOS · Text Fields" },
      { id: "input-otp", title: "Input OTP" },
      { id: "field", title: "Field", figma: "macOS · Forms" },
    ],
  },
  {
    label: "Pickers & menus",
    items: [
      { id: "select", title: "Select", figma: "iOS · Pop-up Buttons" },
      { id: "dropdown-menu", title: "Dropdown Menu", figma: "iOS · Menus" },
      { id: "context-menu", title: "Context Menu", figma: "iOS · Contextual Menus" },
      { id: "command", title: "Command" },
    ],
  },
  {
    label: "Overlays",
    items: [
      { id: "dialog", title: "Dialog", figma: "macOS · Dialogs" },
      { id: "alert-dialog", title: "Alert Dialog", figma: "iOS · Alerts" },
      { id: "sheet", title: "Sheet", figma: "iOS · Sheets" },
      { id: "drawer", title: "Drawer", figma: "iOS · Sheets" },
      { id: "popover", title: "Popover", figma: "iOS · Popovers" },
      { id: "tooltip", title: "Tooltip", figma: "macOS · Tooltips" },
      { id: "hover-card", title: "Hover Card", figma: "macOS · Popovers" },
      { id: "toast", title: "Toast", figma: "iOS · Notifications" },
    ],
  },
  {
    label: "Content",
    items: [
      { id: "card", title: "Card", figma: "macOS · Group Boxes" },
      { id: "item", title: "Item", figma: "iOS · Lists" },
      { id: "table", title: "Table", figma: "macOS · Lists and Tables" },
      { id: "accordion", title: "Accordion", figma: "macOS · Disclosure Controls" },
      { id: "alert", title: "Alert" },
      { id: "avatar", title: "Avatar" },
      { id: "badge", title: "Badge" },
      { id: "empty", title: "Empty", figma: "iOS · Empty States" },
      { id: "skeleton", title: "Skeleton" },
      { id: "spinner", title: "Spinner" },
    ],
  },
  {
    label: "Navigation",
    items: [
      { id: "tabs", title: "Tabs", figma: "iOS · Tab Bars" },
      { id: "breadcrumb", title: "Breadcrumb" },
      { id: "pagination", title: "Pagination", figma: "iOS · Page Controls" },
      { id: "menubar", title: "Menubar", figma: "macOS · Menu Bar and Dock" },
      { id: "scroll-area", title: "Scroll Area", figma: "macOS · Scrollbar" },
      { id: "kbd", title: "Kbd", figma: "iOS · Keyboards" },
    ],
  },
  {
    label: "Layout & misc",
    items: [
      { id: "collapsible", title: "Collapsible", figma: "macOS · Disclosure Controls" },
      { id: "button-group", title: "Button Group", figma: "macOS · Toolbars" },
      { id: "input-group", title: "Input Group", figma: "macOS · Search Fields" },
      { id: "native-select", title: "Native Select" },
      { id: "aspect-ratio", title: "Aspect Ratio" },
      { id: "carousel", title: "Carousel" },
      { id: "resizable", title: "Resizable" },
      { id: "calendar", title: "Calendar", figma: "iOS · Date and Time Pickers" },
    ],
  },
]

export const ALL_SECTIONS: Section[] = SECTION_GROUPS.flatMap((g) => g.items)

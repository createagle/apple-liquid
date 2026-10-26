"use client";

import * as React from "react";
import {
  BellIcon,
  BoldIcon,
  CheckIcon,
  ChevronRightIcon,
  HeartIcon,
  HouseIcon,
  ItalicIcon,
  MonitorIcon,
  MoonIcon,
  SearchIcon,
  SettingsIcon,
  SunIcon,
  TrashIcon,
  UnderlineIcon,
  UserIcon,
  WifiIcon,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import GlassSurface from "@/components/ui/glass-surface"
import { Input } from "@/components/ui/input/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ButtonGroup } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  ExpanderRow,
} from "@/components/ui/collapsible";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { SitePreferencesPanel } from "@/components/site-preferences-panel";

import { InstallSection } from "./install";
import { Section } from "./section";

const ACCENTS = [
  ["blue", "--apple-blue"],
  ["red", "--apple-red"],
  ["green", "--apple-green"],
  ["orange", "--apple-orange"],
  ["yellow", "--apple-yellow"],
  ["pink", "--apple-pink"],
  ["purple", "--apple-purple"],
  ["teal", "--apple-teal"],
  ["indigo", "--apple-indigo"],
  ["mint", "--apple-mint"],
  ["brown", "--apple-brown"],
  ["cyan", "--apple-cyan"],
] as const;

const CITIES = [
  { value: "sf", label: "San Francisco" },
  { value: "la", label: "Los Angeles" },
  { value: "cupertino", label: "Cupertino" },
];

const APPEARANCES = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
];

function ExpanderRowDemo() {
  const [appearance, setAppearance] = React.useState("light");

  return (
    <ExpanderRow
      className="w-full max-w-md"
      label="Appearance"
      value={appearance}
      options={APPEARANCES}
      onValueChange={setAppearance}
    />
  );
}

export default function ComponentsPage() {
  const [sliderValue, setSliderValue] = React.useState(38);
  // AlertDialogAction deliberately does not close on its own — the action
  // normally runs async work first — so the demo drives `open` itself.
  const [alertOpen, setAlertOpen] = React.useState(false);
  // `indeterminate` is a controlled prop: hard-coding it pins the checkbox in
  // the mixed state forever. Deriving it from children is the real use case.
  const [labels, setLabels] = React.useState([true, false]);
  const [commandOpen, setCommandOpen] = React.useState(false);

  // The palette is a keyboard-first surface, so wire the usual shortcut up too.
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex flex-col gap-14 pb-32">
      <header className="flex flex-col gap-3">
        <h1 className="text-[34px] leading-tight font-bold tracking-tight">
          Components
        </h1>
        <p className="max-w-2xl text-[15px] text-label-secondary">
          Every shadcn/ui component restyled against the Apple{" "}
          <em>iOS &amp; iPadOS 27</em> and <em>macOS 27</em> Figma kits — Liquid
          Glass surfaces, capsule controls, the Apple system palette, and
          Motion-driven transitions. Below <code>768px</code>, pickers and menus
          become bottom sheets; tooltips and hover cards open as dialogs.
        </p>
      </header>

      {/* ------------------------------- Install ------------------------------- */}
      <InstallSection />

      {/* ----------------------------- Appearance ------------------------------ */}
      <section id="appearance" className="scroll-mt-24">
        <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-[22px] font-semibold tracking-tight">Appearance</h2>
          <span className="rounded-full bg-fill-tertiary px-2 py-0.5 text-[11px] text-label-secondary">
            Site preferences
          </span>
        </div>
        <p className="mb-4 max-w-2xl text-[14px] text-label-secondary">
          Primary color and glass transparency are CSS variables on{" "}
          <code>&lt;html&gt;</code>. Change them here and every component below
          follows.
        </p>
        <SitePreferencesPanel />
      </section>

      {/* ----------------------------- Foundations ----------------------------- */}
      <Section
        id="colors"
        title="Colors"
        figma="Colors"
        description="System accents read straight off the kits: Accents/Blue is #0088FF in light mode, Accents/Red is #FF383C."
      >
        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {ACCENTS.map(([name, token]) => (
            <div key={name} className="flex flex-col gap-1.5">
              <div
                className="h-14 rounded-[14px] shadow-[0_0_0_0.5px_var(--glass-hairline)]"
                style={{ background: `var(${token})` }}
              />
              <span className="text-[12px] text-label-secondary">{name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="materials"
        title="Materials"
        figma="Materials"
        description="The Liquid Glass stack: a backdrop blur plus the kit's ±1.25px refraction edges and 0.5px hairline."
        className="relative overflow-hidden bg-[linear-gradient(120deg,var(--apple-indigo),var(--apple-pink)_45%,var(--apple-orange))] p-10"
      >
        <div className="glass glass-sheen relative flex h-24 flex-1 items-center justify-center rounded-[22px] text-[15px] font-medium text-white">
          .glass
        </div>
        <div className="glass-prominent glass-sheen relative flex h-24 flex-1 items-center justify-center rounded-[22px] text-[15px] font-medium text-primary-foreground">
          .glass-prominent
        </div>
      </Section>

      <Section
        id="glass-surface"
        title="Glass Surface"
        figma="React Bits"
        description="React Bits' GlassSurface, vendored as-is and configured with the numbers from its own demo. This is the clear variant: it floats over a picture, not over text, which is what lets the refraction stay unblurred."
        className="relative justify-center overflow-hidden bg-[linear-gradient(140deg,var(--apple-indigo),var(--apple-purple)_35%,var(--apple-pink)_65%,var(--apple-orange))] p-10"
      >
        <GlassSurface
          width={320}
          height={76}
          borderRadius={38}
          distortionScale={-180}
          displace={0.5}
          backgroundOpacity={0.1}
        >
          <div className="flex items-center gap-8 text-white">
            <HouseIcon className="size-5" />
            <SearchIcon className="size-5" />
            <HeartIcon className="size-5" />
            <UserIcon className="size-5" />
          </div>
        </GlassSurface>
      </Section>

      <Section
        id="typography"
        title="Typography"
        figma="Text Styles"
        description="SF Pro when the OS has it, with the kit's ss16 stylistic set and wdth 100 axis enabled globally."
        className="flex-col items-start gap-2"
      >
        <p className="text-[34px] leading-tight font-bold tracking-tight">
          Large Title
        </p>
        <p className="text-[28px] font-bold tracking-tight">Title 1</p>
        <p className="text-[22px] font-semibold">Title 2</p>
        <p className="text-[17px] font-semibold">Headline</p>
        <p className="text-[17px]">
          Body — the quick brown fox jumps over the lazy dog.
        </p>
        <p className="text-[15px] text-label-secondary">Subheadline</p>
        <p className="text-[13px] text-label-secondary">Footnote</p>
        <p className="text-[12px] text-label-tertiary">Caption</p>
      </Section>

      {/* ------------------------------- Controls ------------------------------ */}
      <Section
        id="button"
        title="Button"
        figma="iOS · Buttons"
        description="Liquid Glass (glass / glass-prominent), bordered, tinted and borderless — heights 28 / 34 / 50 straight from the kit."
      >
        <Button>Prominent</Button>
        <Button variant="glass">Glass</Button>
        <Button variant="outline">Bordered</Button>
        <Button variant="secondary">Tinted</Button>
        <Button variant="ghost">Borderless</Button>
        <Button variant="destructive">Delete</Button>
        <Button variant="destructiveGhost">Destructive</Button>
        <Button variant="link">Link</Button>
        <Separator orientation="vertical" className="data-vertical:h-8" />
        <Button size="sm">Small</Button>
        <Button size="default">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" aria-label="Settings">
          <SettingsIcon />
        </Button>
        <Button disabled>Disabled</Button>
      </Section>

      <Section id="toggle" title="Toggle" figma="macOS · Buttons">
        <Toggle aria-label="Bold">
          <BoldIcon />
        </Toggle>
        <Toggle aria-label="Italic" defaultPressed>
          <ItalicIcon />
        </Toggle>
        <ToggleGroup defaultValue={["bold"]}>
          <ToggleGroupItem value="bold" aria-label="Bold">
            <BoldIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <ItalicIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            <UnderlineIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      </Section>

      <Section
        id="switch"
        title="Switch"
        figma="iOS · Toggles"
        surface="glass"
        description="51×31 track with a 27px knob; the thumb rides a Motion spring. Press one: the knob turns to Liquid Glass while you hold it, the way the HIG asks for controls in the content layer."
      >
        <Switch defaultChecked />
        <Switch />
        <Switch size="sm" defaultChecked />
        <Switch disabled defaultChecked />
      </Section>

      <Section id="checkbox" title="Checkbox" figma="macOS · Toggles">
        <Label className="flex items-center gap-2">
          <Checkbox defaultChecked /> Checked
        </Label>
        <Label className="flex items-center gap-2">
          <Checkbox /> Unchecked
        </Label>
        <Label className="flex items-center gap-2 opacity-60">
          <Checkbox disabled /> Disabled
        </Label>
        {/* Mixed is derived, not hard-coded: tick one child to see it. */}
        <div className="flex w-full flex-col gap-2 border-t border-separator/30 pt-4">
          <Label className="flex items-center gap-2">
            <Checkbox
              checked={labels.every(Boolean)}
              indeterminate={labels.some(Boolean) && !labels.every(Boolean)}
              onCheckedChange={(value) => setLabels(labels.map(() => value))}
            />
            Select all
          </Label>
          <div className="flex flex-col gap-2 pl-6">
            {["Reminders", "Calendars"].map((name, index) => (
              <Label key={name} className="flex items-center gap-2">
                <Checkbox
                  checked={labels[index]}
                  onCheckedChange={(value) =>
                    setLabels(labels.map((v, i) => (i === index ? value : v)))
                  }
                />
                {name}
              </Label>
            ))}
          </div>
        </div>
      </Section>

      <Section id="radio-group" title="Radio Group" figma="macOS · Toggles">
        <RadioGroup defaultValue="one" className="w-full max-w-xs">
          {["one", "two", "three"].map((value) => (
            <Label key={value} className="flex items-center gap-2 capitalize">
              <RadioGroupItem value={value} /> Option {value}
            </Label>
          ))}
        </RadioGroup>
      </Section>

      <Section
        id="slider"
        title="Slider"
        figma="iOS · Sliders"
        surface="glass"
        description="Drag a knob: it turns to Liquid Glass for as long as you hold it, then settles back to solid."
      >
        <div className="flex w-full max-w-md flex-col gap-4">
          <Slider
            value={sliderValue}
            onValueChange={(value) => setSliderValue(value as number)}
          />
          <p className="text-[13px] text-label-secondary tabular-nums">
            {sliderValue}
          </p>
          <Slider defaultValue={[20, 70]} />
        </div>
      </Section>

      <Section
        id="segmented"
        title="Segmented Control"
        figma="iOS · Segmented Controls"
        surface="glass"
        description="Press a segment: the capsule turns to Liquid Glass and refracts whatever it slides over, then settles back to solid once it lands. Grab the capsule itself and it follows your pointer between segments, the way iOS does."
        className="flex-col items-start"
      >
        <Tabs defaultValue="day">
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </Section>

      <Section id="progress" title="Progress" figma="iOS · Progress Indicators">
        <div className="flex w-full max-w-md flex-col gap-5">
          <Progress value={64} />
          <Progress value={24} />
        </div>
      </Section>

      {/* ------------------------------ Text entry ----------------------------- */}
      <Section id="input" title="Input" figma="iOS · Text Fields">
        <div className="flex w-full max-w-md flex-col gap-3">
          <Input placeholder="Search" />
          <Input placeholder="Disabled" disabled />
          <Input placeholder="Invalid" aria-invalid />
        </div>
      </Section>

      <Section id="textarea" title="Textarea" figma="macOS · Text Fields">
        <Textarea
          className="max-w-md"
          placeholder="Write something…"
          defaultValue="Liquid Glass is the material introduced across Apple's OS 26/27 platforms."
        />
      </Section>

      <Section id="input-otp" title="Input OTP">
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </Section>

      <Section
        id="field"
        title="Field"
        figma="macOS · Forms"
        className="flex-col items-stretch"
      >
        <FieldGroup className="max-w-md">
          <Field>
            <FieldLabel
              htmlFor="demo-name"
              required
              hint="Shown on your profile."
            >
              Full name
            </FieldLabel>
            <Input id="demo-name" placeholder="Jane Appleseed" />
          </Field>
          <Field orientation="horizontal">
            <Switch id="demo-sync" defaultChecked />
            <FieldLabel htmlFor="demo-sync">Sync over iCloud</FieldLabel>
          </Field>
        </FieldGroup>
      </Section>

      {/* --------------------------- Pickers & menus --------------------------- */}
      <Section
        id="select"
        title="Select"
        figma="iOS · Pop-up Buttons"
        description="Anchored popover on desktop; a bottom sheet with 48px rows below 768px."
      >
        {/* `items` is what lets Base UI show the label, not the raw value. */}
        <Select defaultValue="sf" items={CITIES}>
          <SelectTrigger>
            <SelectValue placeholder="Pick a city" />
          </SelectTrigger>
          <SelectContent
            title="Choose a city"
            description="Where should we deliver?"
          >
            <SelectGroup>
              <SelectLabel>California</SelectLabel>
              {CITIES.map((city) => (
                <SelectItem key={city.value} value={city.value}>
                  {city.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Section>

      <Section id="dropdown-menu" title="Dropdown Menu" figma="iOS · Menus">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline">Open menu</Button>}
          />
          <DropdownMenuContent
            title="Account"
            description="Signed in as jane@example.com"
          >
            {/* Base UI requires a Group around a menu label. */}
            <DropdownMenuGroup>
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Section>

      <Section
        id="context-menu"
        title="Context Menu"
        figma="iOS · Contextual Menus"
      >
        <ContextMenu>
          <ContextMenuTrigger className="flex h-28 w-full max-w-md items-center justify-center rounded-[14px] border border-dashed border-separator/50 text-[13px] text-label-secondary">
            Right-click, or tap on touch
          </ContextMenuTrigger>
          <ContextMenuContent
            title="Actions"
            description="Applies to the selected item"
          >
            <ContextMenuItem>Copy</ContextMenuItem>
            <ContextMenuItem>Duplicate</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Delete</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Section>

      <Section
        id="command"
        title="Command"
        description="Opens on click or ⌘K; a centred palette on desktop, a bottom sheet on touch."
      >
        <Button variant="outline" onClick={() => setCommandOpen(true)}>
          <SearchIcon />
          Open command palette
          <KbdGroup className="ml-2">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </Button>
        <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
          <CommandInput placeholder="Type a command…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {[
                { icon: <SearchIcon />, label: "Search" },
                { icon: <BellIcon />, label: "Notifications" },
                { icon: <SettingsIcon />, label: "Settings" },
              ].map((item) => (
                <CommandItem
                  key={item.label}
                  onSelect={() => setCommandOpen(false)}
                >
                  {item.icon} {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </Section>

      {/* ------------------------------- Overlays ------------------------------ */}
      <Section id="dialog" title="Dialog" figma="macOS · Dialogs">
        <Dialog>
          <DialogTrigger
            render={<Button variant="outline">Open dialog</Button>}
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename item</DialogTitle>
              <DialogDescription>
                Choose a new name for this item.
              </DialogDescription>
            </DialogHeader>
            <Input defaultValue="Untitled" />
            <DialogFooter>
              {/* Plain Buttons do nothing here — closing needs DialogClose. */}
              <DialogClose
                render={<Button variant="secondary">Cancel</Button>}
              />
              <DialogClose render={<Button>Save</Button>} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>

      <Section id="alert-dialog" title="Alert Dialog" figma="iOS · Alerts">
        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogTrigger
            render={<Button variant="destructive">Delete</Button>}
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this file?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                render={<Button variant="secondary">Cancel</Button>}
              />
              <AlertDialogAction
                render={
                  <Button
                    variant="destructive"
                    onClick={() => setAlertOpen(false)}
                  >
                    Delete
                  </Button>
                }
              />
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Section>

      <Section id="sheet" title="Sheet" figma="iOS · Sheets">
        <Sheet>
          <SheetTrigger
            render={<Button variant="outline">Open sheet</Button>}
          />
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Details</SheetTitle>
              <SheetDescription>
                A side sheet built on the same glass material.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </Section>

      <Section id="drawer" title="Drawer" figma="iOS · Sheets">
        <Drawer>
          <DrawerTrigger
            render={<Button variant="outline">Open drawer</Button>}
          />
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Bottom drawer</DrawerTitle>
              <DrawerDescription>
                The same surface every picker collapses into on a phone.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4" />
          </DrawerContent>
        </Drawer>
      </Section>

      <Section id="popover" title="Popover" figma="iOS · Popovers">
        <Popover>
          <PopoverTrigger
            render={<Button variant="outline">Open popover</Button>}
          />
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>Display</PopoverTitle>
              <PopoverDescription>Adjust the layout.</PopoverDescription>
            </PopoverHeader>
            <Slider defaultValue={50} />
          </PopoverContent>
        </Popover>
      </Section>

      <Section
        id="tooltip"
        title="Tooltip"
        figma="macOS · Tooltips"
        description="Hover on a pointer device; tap for a dialog on touch."
      >
        <Tooltip>
          <TooltipTrigger
            render={<Button variant="outline">Hover or tap</Button>}
          />
          <TooltipContent title="Add item" description="What this button does">
            Adds a new item to the library
          </TooltipContent>
        </Tooltip>
      </Section>

      <Section
        id="hover-card"
        title="Hover Card"
        figma="macOS · Popovers"
        description="Hover on a pointer device; tap for a dialog on touch."
      >
        <HoverCard>
          <HoverCardTrigger
            render={<Button variant="link">@createagle</Button>}
          />
          <HoverCardContent title="Createagle" description="Profile preview">
            <div className="flex gap-3">
              <Avatar>
                <AvatarFallback>CA</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-[15px] font-medium">Createagle</p>
                <p className="text-[13px] text-label-secondary">
                  Building documentation tools.
                </p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </Section>

      <Section id="toast" title="Toast" figma="iOS · Notifications">
        <Button
          variant="outline"
          onClick={() =>
            toast.add({
              title: "Backup complete",
              description: "12 files synced to iCloud.",
            })
          }
        >
          Show toast
        </Button>
      </Section>

      {/* ------------------------------- Content ------------------------------- */}
      <Section id="card" title="Card" figma="macOS · Group Boxes">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>iCloud Storage</CardTitle>
            <CardDescription>42 GB of 200 GB used</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={21} />
          </CardContent>
          <CardFooter>
            <Button size="sm">Manage</Button>
          </CardFooter>
        </Card>
      </Section>

      <Section
        id="item"
        title="Item"
        figma="iOS · Lists"
        className="flex-col items-stretch"
      >
        <ItemGroup className="apple-group w-full max-w-md">
          <Item>
            <ItemMedia>
              <WifiIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Wi-Fi</ItemTitle>
              <ItemDescription>Createagle-5G</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="size-4 text-label-tertiary" />
            </ItemActions>
          </Item>
          <Item>
            <ItemMedia>
              <BellIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Notifications</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Switch defaultChecked />
            </ItemActions>
          </Item>
        </ItemGroup>
      </Section>

      <Section
        id="table"
        title="Table"
        figma="macOS · Lists and Tables"
        className="flex-col items-stretch"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Kind</TableHead>
              <TableHead className="text-right">Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              ["Design.sketch", "Document", "18.2 MB"],
              ["Notes.md", "Markdown", "4 KB"],
              ["Render.mov", "Movie", "1.4 GB"],
            ].map(([name, kind, size]) => (
              <TableRow key={name}>
                <TableCell className="font-medium">{name}</TableCell>
                <TableCell className="text-label-secondary">{kind}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {size}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section
        id="accordion"
        title="Accordion"
        figma="macOS · Disclosure Controls"
        className="flex-col items-stretch"
      >
        <Accordion className="w-full max-w-md">
          <AccordionItem value="a">
            <AccordionTrigger>What is Liquid Glass?</AccordionTrigger>
            <AccordionContent>
              The material Apple introduced across its OS 26/27 platforms: a
              refracting, blurring layer that picks up the content behind it.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>
              Where do these tokens come from?
            </AccordionTrigger>
            <AccordionContent>
              Read out of the official Apple Design Resources Figma kits with
              the Figma MCP.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section id="alert" title="Alert" className="flex-col items-stretch">
        <Alert>
          <BellIcon />
          <AlertTitle>Update available</AlertTitle>
          <AlertDescription>Version 27.1 is ready to install.</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <TrashIcon />
          <AlertTitle>Storage almost full</AlertTitle>
          <AlertDescription>Free up space to keep syncing.</AlertDescription>
        </Alert>
      </Section>

      <Section id="avatar" title="Avatar">
        <Avatar>
          <AvatarFallback>JA</AvatarFallback>
        </Avatar>
        <AvatarGroup>
          <Avatar>
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>B</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </Section>

      <Section id="badge" title="Badge">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="ghost">Ghost</Badge>
        <Badge>
          <CheckIcon /> Verified
        </Badge>
      </Section>

      <Section
        id="empty"
        title="Empty"
        figma="iOS · Empty States"
        className="flex-col items-stretch"
      >
        <Empty className="w-full">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchIcon />
            </EmptyMedia>
            <EmptyTitle>No results</EmptyTitle>
            <EmptyDescription>Try a different search term.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Section>

      <Section
        id="skeleton"
        title="Skeleton"
        className="flex-col items-stretch"
      >
        <div className="flex w-full max-w-md items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
        </div>
      </Section>

      <Section id="spinner" title="Spinner">
        <Spinner />
        <Spinner className="size-6 text-primary" />
        <Button disabled>
          <Spinner /> Loading
        </Button>
      </Section>

      {/* ------------------------------ Navigation ----------------------------- */}
      <Section
        id="tabs"
        title="Tabs"
        figma="iOS · Tab Bars"
        surface="glass"
        description="Same capsule as the segmented control: glass while you press it, solid once it has moved."
        className="flex-col items-stretch"
      >
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-2 text-label-secondary">
            Everything at a glance.
          </TabsContent>
          <TabsContent value="activity" className="pt-2 text-label-secondary">
            Recent activity shows up here.
          </TabsContent>
          <TabsContent value="settings" className="pt-2 text-label-secondary">
            Adjust your preferences.
          </TabsContent>
        </Tabs>
      </Section>

      <Section id="breadcrumb" title="Breadcrumb">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Section>

      <Section id="pagination" title="Pagination" figma="iOS · Page Controls">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Section>

      <Section id="menubar" title="Menubar" figma="macOS · Menu Bar and Dock">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New Window</MenubarItem>
              <MenubarItem>Open…</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Close</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Undo</MenubarItem>
              <MenubarItem>Redo</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </Section>

      <Section id="scroll-area" title="Scroll Area" figma="macOS · Scrollbar">
        <ScrollArea className="h-40 w-full max-w-md rounded-[14px] bg-fill-tertiary/50 p-4">
          <div className="flex flex-col gap-2 text-[14px]">
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i}>Row {i + 1}</p>
            ))}
          </div>
        </ScrollArea>
      </Section>

      <Section id="kbd" title="Kbd" figma="iOS · Keyboards">
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>⇧</Kbd>
          <Kbd>⌥</Kbd>
          <Kbd>F</Kbd>
        </KbdGroup>
      </Section>

      {/* ----------------------------- Layout & misc --------------------------- */}
      <Section
        id="collapsible"
        title="Collapsible"
        figma="macOS · Disclosure Controls"
        className="flex-col items-stretch"
      >
        <Collapsible className="w-full max-w-md">
          <CollapsibleTrigger
            render={<Button variant="outline">Toggle details</Button>}
          />
          <CollapsibleContent className="pt-3 text-[14px] text-label-secondary">
            Disclosure controls expand in place rather than pushing a new view.
          </CollapsibleContent>
        </Collapsible>
      </Section>

      <Section
        id="expander-row"
        title="Expander Row"
        figma="iOS · Disclosure Controls"
        description="A one-line preference that expands its options in place — for popovers and sheets, where a second layer would be one too many."
        className="flex-col items-stretch"
      >
        <ExpanderRowDemo />
      </Section>

      <Section id="button-group" title="Button Group" figma="macOS · Toolbars">
        <ButtonGroup>
          <Button variant="outline">Cut</Button>
          <Button variant="outline">Copy</Button>
          <Button variant="outline">Paste</Button>
        </ButtonGroup>
      </Section>

      <Section
        id="input-group"
        title="Input Group"
        figma="macOS · Search Fields"
        className="flex-col items-stretch"
      >
        <InputGroup className="max-w-md">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search" />
        </InputGroup>
      </Section>

      <Section id="native-select" title="Native Select">
        <NativeSelect defaultValue="cupertino">
          <NativeSelectOption value="sf">San Francisco</NativeSelectOption>
          <NativeSelectOption value="la">Los Angeles</NativeSelectOption>
          <NativeSelectOption value="cupertino">Cupertino</NativeSelectOption>
        </NativeSelect>
      </Section>

      <Section
        id="aspect-ratio"
        title="Aspect Ratio"
        className="flex-col items-stretch"
      >
        <AspectRatio
          ratio={16 / 9}
          className="max-w-md overflow-hidden rounded-[14px] bg-[linear-gradient(120deg,var(--apple-indigo),var(--apple-teal))]"
        />
      </Section>

      <Section
        id="carousel"
        title="Carousel"
        className="flex-col items-stretch"
      >
        <Carousel className="mx-auto w-full max-w-sm">
          <CarouselContent>
            {[1, 2, 3].map((n) => (
              <CarouselItem key={n}>
                <div className="flex h-32 items-center justify-center rounded-[14px] bg-fill-tertiary text-[22px] font-semibold">
                  {n}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Section>

      <Section
        id="resizable"
        title="Resizable"
        className="flex-col items-stretch"
      >
        <ResizablePanelGroup className="h-36 max-w-md rounded-[14px] shadow-[0_0_0_0.5px_var(--glass-hairline)]">
          <ResizablePanel defaultSize={40}>
            <div className="flex h-full items-center justify-center text-[13px] text-label-secondary">
              Sidebar
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60}>
            <div className="flex h-full items-center justify-center text-[13px] text-label-secondary">
              Content
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Section>

      <Section
        id="calendar"
        title="Calendar"
        figma="iOS · Date and Time Pickers"
        className="flex-col items-stretch"
      >
        <Calendar mode="single" className="rounded-[14px]" />
      </Section>
    </div>
  );
}

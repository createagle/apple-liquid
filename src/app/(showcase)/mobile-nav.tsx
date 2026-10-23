"use client"

import * as React from "react"
import { ListIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { ComponentsNav } from "./nav"

/**
 * The sidebar is desktop-only, so on smaller screens the section index lives
 * in a bottom drawer — the same surface every other menu collapses into.
 */
function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        render={
          <Button
            variant="glass"
            size="icon"
            className="lg:hidden"
            aria-label="Open component index"
          >
            <ListIcon />
          </Button>
        }
      />
      <DrawerContent className="max-h-[80dvh]">
        <DrawerHeader>
          <DrawerTitle>Components</DrawerTitle>
          <DrawerDescription>Jump to a section</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto overscroll-contain px-4 pt-2 pb-[max(env(safe-area-inset-bottom),1rem)]">
          <ComponentsNav onNavigate={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export { MobileNav }

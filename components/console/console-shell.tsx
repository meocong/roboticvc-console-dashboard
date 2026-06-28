"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { MenuIcon } from "lucide-react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { SidebarNav } from "./sidebar-nav"
import { GlobalSearch } from "./global-search"
import { ThemeToggle } from "./theme-toggle"
import { pageTitles } from "./nav-items"

export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const meta =
    pageTitles[pathname] ??
    pageTitles[
      Object.keys(pageTitles).find(
        (k) => k !== "/" && pathname.startsWith(k),
      ) ?? "/"
    ]

  return (
    <div className="flex min-h-svh bg-background">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 border-r bg-sidebar lg:block">
        <SidebarNav />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 bg-sidebar p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">Điều hướng</SheetTitle>
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
          <Button
            variant="outline"
            size="icon-sm"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Mở menu"
          >
            <MenuIcon className="size-4" />
          </Button>
          <div className="hidden min-w-0 md:block">
            <h1 className="truncate text-base font-semibold leading-tight tracking-tight">
              {meta?.title}
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              {meta?.description}
            </p>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2">
            <GlobalSearch />
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <div className="mx-auto w-full max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  )
}

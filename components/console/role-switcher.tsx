"use client"

import * as React from "react"
import { ShieldIcon, Building2Icon, CheckIcon, ChevronDownIcon } from "lucide-react"
import { useSession } from "@/lib/session"
import { facilities } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function RoleSwitcher() {
  const { role, facilityId, setSession } = useSession()
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const current =
    role === "superadmin"
      ? { label: "Superadmin", sub: "Toàn hệ thống" }
      : { label: "Admin cơ sở", sub: facilities.find((f) => f.id === facilityId)?.name ?? "—" }

  function pick(s: { role: "superadmin" | "facility_admin"; facilityId: string | null }) {
    setSession(s)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border bg-card px-2.5 py-1.5 text-left transition-colors hover:bg-accent/40"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Đổi vai trò"
      >
        <span
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-md",
            role === "superadmin" ? "bg-primary/10 text-primary" : "bg-info/12 text-info",
          )}
        >
          {role === "superadmin" ? <ShieldIcon className="size-3.5" /> : <Building2Icon className="size-3.5" />}
        </span>
        <span className="hidden min-w-0 flex-col leading-tight sm:flex">
          <span className="truncate text-xs font-semibold">{current.label}</span>
          <span className="max-w-[140px] truncate text-[10px] text-muted-foreground">{current.sub}</span>
        </span>
        <ChevronDownIcon className="size-3.5 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1.5 w-64 overflow-hidden rounded-lg border bg-popover p-1 shadow-lg">
          <p className="px-2 py-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Vai trò (demo)
          </p>
          <button
            type="button"
            onClick={() => pick({ role: "superadmin", facilityId: null })}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent/60"
          >
            <ShieldIcon className="size-4 text-primary" />
            <span className="flex-1 text-left">Superadmin</span>
            {role === "superadmin" && <CheckIcon className="size-4" />}
          </button>

          <div className="my-1 border-t" />
          <p className="px-2 py-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Admin cơ sở
          </p>
          <div className="max-h-64 overflow-y-auto">
            {facilities.map((f) => {
              const active = role === "facility_admin" && facilityId === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => pick({ role: "facility_admin", facilityId: f.id })}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent/60"
                >
                  <Building2Icon className="size-4 shrink-0 text-info" />
                  <span className="flex-1 truncate text-left">{f.name}</span>
                  {active && <CheckIcon className="size-4 shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

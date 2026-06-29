"use client"

import * as React from "react"
import { ShieldIcon, Building2Icon, CheckIcon, ChevronDownIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from "@/lib/session"
import { facilities } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function RoleSwitcher() {
  const { role, facilityId, setSession } = useSession()

  const current =
    role === "superadmin"
      ? { label: "Superadmin", sub: "Toàn hệ thống" }
      : {
          label: "Admin cơ sở",
          sub: facilities.find((f) => f.id === facilityId)?.name ?? "—",
        }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 rounded-lg border bg-card px-2.5 py-1.5 text-left transition-colors hover:bg-accent/40"
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
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Vai trò (demo)</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setSession({ role: "superadmin", facilityId: null })}>
          <ShieldIcon className="size-4 text-primary" />
          <span className="flex-1">Superadmin</span>
          {role === "superadmin" && <CheckIcon className="size-4" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Admin cơ sở</DropdownMenuLabel>
        {facilities.map((f) => {
          const active = role === "facility_admin" && facilityId === f.id
          return (
            <DropdownMenuItem
              key={f.id}
              onClick={() => setSession({ role: "facility_admin", facilityId: f.id })}
            >
              <Building2Icon className="size-4 text-info" />
              <span className="flex-1 truncate">{f.name}</span>
              {active && <CheckIcon className="size-4" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

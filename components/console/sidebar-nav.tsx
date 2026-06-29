"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { TargetIcon } from "lucide-react"
import { navItems, type NavItem } from "./nav-items"
import { useSession } from "@/lib/session"
import { cn } from "@/lib/utils"

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { role, facilityId } = useSession()

  // Admin cơ sở: chỉ Tổng quan (cơ sở mình) + CTV + Thiết bị + Video.
  // Ẩn Phiên bản (firmware toàn hệ thống) + Cơ sở (danh sách nhiều cơ sở).
  const items: NavItem[] =
    role === "facility_admin"
      ? navItems
          .filter((i) => ["/", "/cong-tac-vien", "/thiet-bi", "/video"].includes(i.href))
          .map((i) =>
            i.href === "/" && facilityId
              ? { ...i, href: `/co-so/${facilityId}`, label: "Tổng quan cơ sở" }
              : i,
          )
      : navItems

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2.5 border-b px-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/tbrain-logo-sm.png"
          alt="Tbrain"
          className="h-6 w-auto shrink-0 dark:brightness-0 dark:invert"
          draggable={false}
        />
        <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[11px] font-semibold text-primary">
          RoboticVC
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        <p className="px-2 pb-1 pt-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Vận hành
        </p>
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
              )}
              <Icon className={cn("size-4 shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-3">
        <div className="flex items-start gap-2.5 rounded-xl bg-gradient-to-br from-primary/10 to-info/5 p-3">
          <TargetIcon className="mt-0.5 size-4 shrink-0 text-primary" />
          <div>
            <p className="text-xs font-semibold">Dữ liệu chất lượng hôm nay</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">Robot thông minh ngày mai</p>
          </div>
        </div>
      </div>
    </div>
  )
}

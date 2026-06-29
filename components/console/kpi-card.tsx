import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const iconMap = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/12 text-success",
  info: "bg-info/12 text-info",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/12 text-danger",
  neutral: "bg-muted text-muted-foreground",
} as const

const barMap = {
  primary: "bg-primary",
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  danger: "bg-danger",
  neutral: "bg-muted-foreground/50",
} as const

export function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "primary",
}: {
  label: string
  value: string | number
  sub?: string
  icon: LucideIcon
  accent?: keyof typeof iconMap
}) {
  return (
    <Card className="relative gap-0 overflow-hidden p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <span className={cn("absolute inset-y-0 left-0 w-1", barMap[accent])} />
      <div className="flex items-start justify-between gap-2 pl-1.5">
        <p className="truncate pt-0.5 text-xs font-medium text-muted-foreground">{label}</p>
        <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", iconMap[accent])}>
          <Icon className="size-[18px]" />
        </div>
      </div>
      <p className="pl-1.5 text-3xl font-bold tracking-tight tabular-nums">{value}</p>
      {sub && <p className="truncate pl-1.5 text-xs text-muted-foreground">{sub}</p>}
    </Card>
  )
}

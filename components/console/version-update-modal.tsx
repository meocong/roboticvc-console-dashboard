"use client"

import * as React from "react"
import { CheckIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/console/status-badge"
import { versions } from "@/lib/mock-data"
import { channelMeta } from "@/lib/labels"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"

export function VersionUpdateModal({
  open,
  onOpenChange,
  deviceCount,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  deviceCount: number
  onConfirm: (versionTag: string) => void
}) {
  const targets = React.useMemo(() => versions.filter((v) => v.active), [])
  const [target, setTarget] = React.useState(targets[0]?.tag ?? "")

  React.useEffect(() => {
    if (open) setTarget(targets[0]?.tag ?? "")
  }, [open, targets])

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false)
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="flex w-full max-w-md flex-col gap-4 rounded-xl border bg-card p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">Đẩy bản cập nhật</h2>
            <p className="text-sm text-muted-foreground">
              Áp dụng cho <span className="font-medium text-foreground">{deviceCount}</span> thiết bị
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Đóng"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Chọn phiên bản đích
          </p>
          {targets.map((v) => {
            const cm = channelMeta[v.channel]
            const active = target === v.tag
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setTarget(v.tag)}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                  active ? "border-ring bg-accent/60 ring-1 ring-ring/40" : "hover:bg-accent/40",
                )}
              >
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-full border",
                    active ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40",
                  )}
                >
                  {active && <CheckIcon className="size-3" />}
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="font-mono text-sm font-medium">{v.tag}</span>
                  <span className="text-xs text-muted-foreground">Phát hành {formatDate(v.releasedAt)}</span>
                </div>
                <StatusBadge label={cm.label} tone={cm.tone} dot={false} />
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            size="sm"
            disabled={!target}
            onClick={() => {
              onConfirm(target)
              onOpenChange(false)
            }}
          >
            Đẩy cập nhật
          </Button>
        </div>
      </div>
    </div>
  )
}

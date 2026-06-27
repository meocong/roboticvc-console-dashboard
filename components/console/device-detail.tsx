"use client"

import { CpuIcon } from "lucide-react"
import {
  DetailDrawer,
  DetailRow,
  DetailSection,
} from "@/components/console/detail-drawer"
import { StatusBadge } from "@/components/console/status-badge"
import { Meter } from "@/components/console/meter"
import { Button } from "@/components/ui/button"
import { deviceStatusMeta } from "@/lib/labels"
import { collaboratorName, facilityName } from "@/lib/mock-data"
import { formatGb, formatRelativeTime } from "@/lib/format"
import type { Device } from "@/lib/types"

export function DeviceDetail({
  device,
  open,
  onOpenChange,
  onUpdate,
}: {
  device: Device | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate?: () => void
}) {
  const meta = device ? deviceStatusMeta[device.status] : null
  const usedPct = device
    ? Math.round(((device.totalStorageGb - device.freeStorageGb) / device.totalStorageGb) * 100)
    : 0
  const needsUpdate = device ? device.targetVersion !== device.appVersion : false

  return (
    <DetailDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={device?.name ?? ""}
      description={device ? `${device.model} · ${device.hardwareId}` : ""}
      badge={meta && <StatusBadge label={meta.label} tone={meta.tone} pulse={device?.status === "online"} />}
      footer={
        <>
          <Button
            size="sm"
            onClick={() => {
              onOpenChange(false)
              onUpdate?.()
            }}
          >
            Đẩy cập nhật
          </Button>
          <Button size="sm" variant="outline">
            Gán cơ sở / CTV
          </Button>
        </>
      }
    >
      {device && (
        <>
          <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3.5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CpuIcon className="size-6" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-mono font-medium">{device.name}</span>
              <span className="font-mono text-xs text-muted-foreground">{device.hardwareId}</span>
            </div>
          </div>

          <DetailSection title="Lưu trữ & pin">
            <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3.5">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Dung lượng trống</span>
                  <span className="font-medium tabular-nums">
                    {formatGb(device.freeStorageGb)} / {formatGb(device.totalStorageGb)}
                  </span>
                </div>
                <Meter value={usedPct} tone={usedPct > 85 ? "danger" : usedPct > 65 ? "warning" : "success"} />
              </div>
              <DetailRow label="Pin" value={<span className="tabular-nums">{device.battery}%</span>} />
              <DetailRow label="Hàng đợi offline" value={<span className="tabular-nums">{device.offlineQueue}</span>} />
              <DetailRow label="Hoạt động cuối" value={formatRelativeTime(device.lastSeenMinutes)} />
            </div>
          </DetailSection>

          <DetailSection title="Phiên bản">
            <div className="flex flex-col gap-1.5 rounded-lg border bg-muted/30 p-3.5">
              <DetailRow label="Hiện tại" value={<span className="font-mono">{device.appVersion}</span>} />
              <DetailRow
                label="Đích"
                value={
                  needsUpdate ? (
                    <span className="font-mono text-info">{device.targetVersion}</span>
                  ) : (
                    <span className="text-muted-foreground">Đã mới nhất</span>
                  )
                }
              />
            </div>
          </DetailSection>

          <DetailSection title="Phân bổ">
            <div className="flex flex-col gap-1.5 rounded-lg border bg-muted/30 p-3.5">
              <DetailRow label="Cơ sở" value={facilityName(device.facilityId)} />
              <DetailRow label="Cộng tác viên" value={collaboratorName(device.collaboratorId)} />
              <DetailRow label="Model" value={device.model} />
            </div>
          </DetailSection>
        </>
      )}
    </DetailDrawer>
  )
}

"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeftIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  CpuIcon,
  UsersIcon,
  ClapperboardIcon,
  HardDriveIcon,
  ChevronRightIcon,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { KpiCard } from "@/components/console/kpi-card"
import { StatTile } from "@/components/console/stat-tile"
import { StatusBadge } from "@/components/console/status-badge"
import { Meter } from "@/components/console/meter"
import { facilityById, facilityStats } from "@/lib/mock-data"
import {
  facilityStatusMeta,
  deviceStatusMeta,
  collaboratorStatusMeta,
} from "@/lib/labels"
import { formatGb } from "@/lib/format"
import type { DeviceStatus } from "@/lib/types"

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")
}

const DEVICE_SUMMARY: DeviceStatus[] = ["online", "uploading", "updating", "offline", "error"]

export default function FacilityStatsPage() {
  const { id } = useParams<{ id: string }>()
  const facility = facilityById(id)

  if (!facility) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <p className="text-muted-foreground">Không tìm thấy cơ sở</p>
        <Link
          href="/co-so"
          className="inline-flex items-center rounded-md border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
        >
          Quay lại danh sách
        </Link>
      </div>
    )
  }

  const meta = facilityStatusMeta[facility.status]
  const stats = facilityStats(facility.id)
  const deviceCounts = stats.devices.reduce(
    (acc, d) => {
      acc[d.status] = (acc[d.status] ?? 0) + 1
      return acc
    },
    {} as Record<DeviceStatus, number>,
  )

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/co-so"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Cơ sở
      </Link>

      {/* Header */}
      <Card className="flex flex-row flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold">{facility.name}</h1>
            {meta && <StatusBadge label={meta.label} tone={meta.tone} />}
          </div>
          <p className="text-sm text-muted-foreground">
            Mã {facility.code} · {facility.region}
          </p>
        </div>
        <Button size="sm" variant="outline">
          Chỉnh sửa cơ sở
        </Button>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <KpiCard label="Thiết bị" value={stats.devices.length} icon={CpuIcon} accent="info" />
        <KpiCard label="Đang hoạt động" value={stats.online} icon={CpuIcon} accent="success" sub={`${stats.issues} cần chú ý`} />
        <KpiCard label="Cộng tác viên" value={stats.collaborators.length} icon={UsersIcon} accent="primary" />
        <KpiCard label="Video" value={stats.videos.length} icon={ClapperboardIcon} accent="neutral" sub={`${stats.recordedHours}h đã quay`} />
        <KpiCard label="Dung lượng" value={formatGb(stats.usedGb)} icon={HardDriveIcon} accent="warning" />
      </div>

      {/* Device status breakdown */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {DEVICE_SUMMARY.map((s) => {
          const dm = deviceStatusMeta[s]
          return <StatTile key={s} label={dm.label} value={deviceCounts[s] ?? 0} tone={dm.tone} />
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Collaborators */}
        <Card className="gap-0 overflow-hidden py-0">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-sm font-semibold">Cộng tác viên ({stats.collaborators.length})</h2>
          </div>
          <div className="flex flex-col divide-y">
            {stats.collaborators.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">Chưa có CTV</p>
            )}
            {stats.collaborators.map((c) => {
              const cm = collaboratorStatusMeta[c.status]
              return (
                <Link
                  key={c.id}
                  href={`/cong-tac-vien/${c.id}`}
                  className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-accent/40"
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                      {initials(c.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium">{c.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">{c.phone}</span>
                  </div>
                  {cm && <StatusBadge label={cm.label} tone={cm.tone} dot={false} />}
                  <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              )
            })}
          </div>
        </Card>

        {/* Devices */}
        <Card className="gap-0 overflow-hidden py-0">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-sm font-semibold">Thiết bị ({stats.devices.length})</h2>
          </div>
          <div className="flex flex-col divide-y">
            {stats.devices.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">Chưa có thiết bị</p>
            )}
            {stats.devices.map((d) => {
              const dm = deviceStatusMeta[d.status]
              const usedPct = Math.round(((d.totalStorageGb - d.freeStorageGb) / d.totalStorageGb) * 100)
              return (
                <Link
                  key={d.id}
                  href={`/thiet-bi?q=${encodeURIComponent(d.name)}`}
                  className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-accent/40"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="truncate font-mono text-xs font-medium">{d.name}</span>
                    <div className="flex w-28 items-center gap-2">
                      <Meter value={usedPct} tone={usedPct > 85 ? "danger" : usedPct > 65 ? "warning" : "success"} />
                      <span className="text-[10px] tabular-nums text-muted-foreground">{formatGb(d.freeStorageGb)}</span>
                    </div>
                  </div>
                  <StatusBadge label={dm.label} tone={dm.tone} dot={false} />
                  <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Contact */}
      <Card className="flex flex-col gap-2.5 p-4">
        <h2 className="text-sm font-semibold">Thông tin liên hệ</h2>
        <div className="flex items-center gap-2.5 text-sm">
          <MapPinIcon className="size-4 shrink-0 text-muted-foreground" />
          <span>{facility.address}</span>
        </div>
        <Separator />
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
          <span className="flex items-center gap-2">
            <UserIcon className="size-4 shrink-0 text-muted-foreground" />
            {facility.contactName}
          </span>
          <span className="flex items-center gap-2 font-mono">
            <PhoneIcon className="size-4 shrink-0 text-muted-foreground" />
            {facility.contactPhone}
          </span>
        </div>
      </Card>
    </div>
  )
}

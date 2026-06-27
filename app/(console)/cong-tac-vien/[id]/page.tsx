"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeftIcon,
  PhoneIcon,
  ClapperboardIcon,
  TimerIcon,
  ShieldCheckIcon,
  CpuIcon,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { KpiCard } from "@/components/console/kpi-card"
import { StatusBadge } from "@/components/console/status-badge"
import {
  collaboratorById,
  collaboratorStats,
  deviceById,
  facilityName,
  videoAssets,
} from "@/lib/mock-data"
import { collaboratorStatusMeta, deviceStatusMeta, videoStatusMeta, streamLabels } from "@/lib/labels"
import { formatDate, formatDateTime, formatDuration, formatGb } from "@/lib/format"

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")
}

export default function CollaboratorStatsPage() {
  const { id } = useParams<{ id: string }>()
  const collaborator = collaboratorById(id)

  if (!collaborator) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <p className="text-muted-foreground">Không tìm thấy cộng tác viên</p>
        <Link
          href="/cong-tac-vien"
          className="inline-flex items-center rounded-md border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
        >
          Quay lại danh sách
        </Link>
      </div>
    )
  }

  const meta = collaboratorStatusMeta[collaborator.status]
  const stats = collaboratorStats(collaborator.id)
  const device = deviceById(collaborator.assignedDeviceId)
  const deviceMeta = device ? deviceStatusMeta[device.status] : null
  const vids = videoAssets
    .filter((v) => v.collaboratorId === collaborator.id)
    .sort((a, b) => (a.recordedAt < b.recordedAt ? 1 : -1))

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/cong-tac-vien"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Cộng tác viên
      </Link>

      {/* Header */}
      <Card className="flex flex-row flex-wrap items-center gap-4 p-5">
        <Avatar className="size-14">
          <AvatarFallback className="bg-primary/10 text-base font-semibold text-primary">
            {initials(collaborator.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold">{collaborator.name}</h1>
            {meta && <StatusBadge label={meta.label} tone={meta.tone} pulse={collaborator.status === "active"} />}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 font-mono">
              <PhoneIcon className="size-3.5" />
              {collaborator.phone}
            </span>
            <span>{facilityName(collaborator.facilityId)}</span>
            <span>Tham gia {formatDate(collaborator.joinedAt)}</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            {collaborator.skills.map((s) => (
              <Badge key={s} variant="secondary">
                {s}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Video đã quay" value={stats.videos} icon={ClapperboardIcon} accent="info" />
        <KpiCard label="Tổng giờ quay" value={`${stats.recordedHours}h`} icon={TimerIcon} accent="primary" />
        <KpiCard label="Giờ QC" value={`${stats.qcHours}h`} icon={ShieldCheckIcon} accent="success" />
        <KpiCard
          label="Thiết bị đang gán"
          value={device ? "1" : "0"}
          sub={device?.name ?? "Chưa gán"}
          icon={CpuIcon}
          accent="neutral"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Device */}
        <Card className="flex flex-col gap-3 p-4">
          <h2 className="text-sm font-semibold">Thiết bị đang gán</h2>
          {device ? (
            <Link
              href={`/thiet-bi?q=${encodeURIComponent(device.name)}`}
              className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 p-3.5 transition-colors hover:border-ring/60 hover:bg-accent/40"
            >
              <div className="flex flex-col">
                <span className="font-mono text-sm font-medium">{device.name}</span>
                <span className="text-xs text-muted-foreground">
                  {device.model} · {device.appVersion}
                </span>
              </div>
              {deviceMeta && <StatusBadge label={deviceMeta.label} tone={deviceMeta.tone} />}
            </Link>
          ) : (
            <div className="rounded-lg border border-dashed bg-muted/20 p-5 text-center text-sm text-muted-foreground">
              Chưa được gán thiết bị
            </div>
          )}
        </Card>

        {/* Assignment history */}
        <Card className="flex flex-col gap-3 p-4">
          <h2 className="text-sm font-semibold">Lịch sử gán thiết bị</h2>
          <ol className="flex flex-col gap-3 border-l pl-4">
            {collaborator.assignmentHistory.length === 0 && (
              <li className="text-sm text-muted-foreground">Chưa có lịch sử</li>
            )}
            {collaborator.assignmentHistory.map((h, i) => (
              <li key={i} className="relative">
                <span className="absolute top-1 -left-[1.3rem] size-2 rounded-full bg-primary ring-2 ring-background" />
                <p className="font-mono text-sm">{h.deviceName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(h.from)} – {h.to ? formatDate(h.to) : "hiện tại"}
                </p>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {/* Videos */}
      <Card className="gap-0 overflow-hidden py-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-sm font-semibold">Video đã quay ({vids.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="px-4 py-2.5 text-left font-medium">Session</th>
                <th className="px-4 py-2.5 text-left font-medium">Luồng</th>
                <th className="px-4 py-2.5 text-right font-medium">Thời lượng</th>
                <th className="px-4 py-2.5 text-right font-medium">Dung lượng</th>
                <th className="px-4 py-2.5 text-left font-medium">Trạng thái</th>
                <th className="px-4 py-2.5 text-left font-medium">Thời điểm</th>
              </tr>
            </thead>
            <tbody>
              {vids.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Chưa có video
                  </td>
                </tr>
              )}
              {vids.map((v) => {
                const vm = videoStatusMeta[v.status]
                return (
                  <tr key={v.id} className="border-b last:border-0">
                    <td className="px-4 py-2.5 font-mono text-xs">{v.sessionCode}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {v.streams.map((s) => (
                          <Badge key={s} variant="secondary" className="text-[10px]">
                            {streamLabels[s] ?? s}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{formatDuration(v.durationMin)}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{formatGb(v.sizeGb)}</td>
                    <td className="px-4 py-2.5">
                      <StatusBadge label={vm.label} tone={vm.tone} pulse={v.status === "processing"} />
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{formatDateTime(v.recordedAt)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Building2Icon,
  UsersIcon,
  WifiIcon,
  ClapperboardIcon,
  HardDriveIcon,
  ChevronRightIcon,
  TimerIcon,
  ShieldCheckIcon,
} from "lucide-react"
import { KpiCard } from "@/components/console/kpi-card"
import {
  DevicesByFacilityChart,
  UploadTrendChart,
} from "@/components/console/dashboard-charts"
import { StatusBadge } from "@/components/console/status-badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  facilities,
  collaborators,
  devices,
  deviceStatusCounts,
  facilityName,
  collaboratorName,
  pendingVideoCount,
  totalGcsUsedTb,
  totalRecordedHours,
  totalQcHours,
  topCollaboratorsByHours,
} from "@/lib/mock-data"
import { deviceStatusMeta } from "@/lib/labels"
import { formatRelativeTime } from "@/lib/format"
import { useSession } from "@/lib/session"

export default function DashboardPage() {
  const router = useRouter()
  const { role, facilityId } = useSession()

  // Admin cơ sở: tổng quan = trang cơ sở của mình.
  useEffect(() => {
    if (role === "facility_admin" && facilityId) {
      router.replace(`/co-so/${facilityId}`)
    }
  }, [role, facilityId, router])

  const counts = deviceStatusCounts()
  const online = (counts.online ?? 0) + (counts.uploading ?? 0) + (counts.updating ?? 0)
  const offline = (counts.offline ?? 0) + (counts.error ?? 0)

  const attention = devices
    .filter((d) => d.status === "offline" || d.status === "error" || d.offlineQueue >= 8)
    .sort((a, b) => b.offlineQueue - a.offlineQueue)
    .slice(0, 8)

  return (
    <div className="flex flex-col gap-5">
      {/* Hero */}
      <div className="animate-rise relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary to-info p-5 text-primary-foreground shadow-sm sm:p-6">
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-wide text-primary-foreground/80 uppercase">
              Tổng quan thu thập dữ liệu
            </p>
            <p className="mt-1 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
              {totalRecordedHours.toLocaleString("vi-VN")} giờ
            </p>
            <p className="mt-1 text-sm text-primary-foreground/85">
              từ {collaborators.length} CTV · {devices.length} thiết bị · {facilities.length} cơ sở miền Bắc
            </p>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-2xl font-bold tabular-nums">{totalQcHours}h</p>
              <p className="text-xs text-primary-foreground/80">đã QC</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold tabular-nums">{online}/{devices.length}</p>
              <p className="text-xs text-primary-foreground/80">trực tuyến</p>
            </div>
          </div>
        </div>
        <TimerIcon className="absolute -right-6 -bottom-8 size-44 text-primary-foreground/10" strokeWidth={1.2} />
      </div>

      <div className="stagger grid grid-cols-2 gap-3 lg:grid-cols-5">
        <KpiCard label="Cơ sở" value={facilities.length} icon={Building2Icon} sub={`${facilities.filter((f) => f.status === "active").length} đang hoạt động`} />
        <KpiCard label="Cộng tác viên" value={collaborators.length} icon={UsersIcon} accent="info" sub={`${collaborators.filter((c) => c.status === "active").length} đang quay`} />
        <KpiCard label="Thiết bị trực tuyến" value={`${online}/${devices.length}`} icon={WifiIcon} accent="success" sub={`${offline} ngoại tuyến / lỗi`} />
        <KpiCard label="Video chờ xử lý" value={pendingVideoCount} icon={ClapperboardIcon} accent="warning" sub="đang tải lên / xử lý" />
        <KpiCard label="Dung lượng GCS" value={`${totalGcsUsedTb} TB`} icon={HardDriveIcon} accent="neutral" sub="đã sử dụng" />
      </div>

      {/* Sản lượng quay & QC */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="grid grid-cols-2 gap-3">
          <KpiCard label="Tổng giờ đã quay" value={`${totalRecordedHours}h`} icon={TimerIcon} accent="primary" sub="toàn bộ CTV" />
          <KpiCard label="Tổng giờ QC" value={`${totalQcHours}h`} icon={ShieldCheckIcon} accent="success" sub="đảm bảo chất lượng" />
        </div>
        <Card className="gap-0 py-0 lg:col-span-2">
          <CardHeader className="border-b py-3">
            <CardTitle className="text-sm">Top CTV theo giờ quay</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col divide-y">
              {topCollaboratorsByHours(5).map((row, i) => (
                <button
                  key={row.collaborator.id}
                  onClick={() => router.push(`/cong-tac-vien/${row.collaborator.id}`)}
                  className="flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent/40"
                >
                  <span className="w-5 text-sm font-semibold tabular-nums text-muted-foreground">{i + 1}</span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium">{row.collaborator.name}</span>
                    <span className="text-xs text-muted-foreground">{facilityName(row.collaborator.facilityId)}</span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{row.recordedHours}h</span>
                  <span className="text-xs text-muted-foreground">QC {row.qcHours}h</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DevicesByFacilityChart />
        <UploadTrendChart />
      </div>

      <Card className="gap-0 py-0">
        <CardHeader className="flex flex-row items-center justify-between border-b py-4">
          <div>
            <CardTitle className="text-sm">Thiết bị cần chú ý</CardTitle>
            <CardDescription>
              Thiết bị ngoại tuyến, lỗi hoặc có hàng đợi offline cao
            </CardDescription>
          </div>
          <StatusBadge label={`${attention.length} cảnh báo`} tone="warning" dot={false} />
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="text-xs">Thiết bị</TableHead>
                  <TableHead className="text-xs">Cơ sở</TableHead>
                  <TableHead className="text-xs">CTV</TableHead>
                  <TableHead className="text-xs">Trạng thái</TableHead>
                  <TableHead className="text-right text-xs">Hàng đợi</TableHead>
                  <TableHead className="text-right text-xs">Last seen</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {attention.map((d) => {
                  const meta = deviceStatusMeta[d.status]
                  return (
                    <TableRow
                      key={d.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/thiet-bi?q=${encodeURIComponent(d.name)}`)}
                    >
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell className="text-muted-foreground">{facilityName(d.facilityId)}</TableCell>
                      <TableCell className="text-muted-foreground">{collaboratorName(d.collaboratorId)}</TableCell>
                      <TableCell>
                        <StatusBadge label={meta.label} tone={meta.tone} pulse={d.status === "uploading"} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        <span className={d.offlineQueue >= 8 ? "font-semibold text-danger" : ""}>
                          {d.offlineQueue}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground tabular-nums">
                        {formatRelativeTime(d.lastSeenMinutes)}
                      </TableCell>
                      <TableCell>
                        <ChevronRightIcon className="size-4 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

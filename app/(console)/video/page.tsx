"use client"

import * as React from "react"
import { useSession } from "@/lib/session"
import { Badge } from "@/components/ui/badge"
import { SearchInput } from "@/components/console/search-input"
import { FilterSelect } from "@/components/console/filter-select"
import { DataPagination } from "@/components/console/data-pagination"
import {
  DataTable,
  useSortedRows,
  type Column,
} from "@/components/console/data-table"
import { StatusBadge } from "@/components/console/status-badge"
import { StatTile } from "@/components/console/stat-tile"
import { VideoDetail } from "@/components/console/video-detail"
import {
  videoAssets,
  facilities,
  videoStatusCounts,
  facilityName,
  collaboratorName,
  deviceName,
} from "@/lib/mock-data"
import { streamLabels, videoStatusMeta } from "@/lib/labels"
import { formatDateTime, formatDuration, formatGb } from "@/lib/format"
import type { VideoAsset, VideoStatus } from "@/lib/types"

const PAGE_SIZE = 10

const facilityOptions = [
  { label: "Tất cả cơ sở", value: "all" },
  ...facilities.map((f) => ({ label: f.name, value: f.id })),
]

const statusOptions = [
  { label: "Tất cả trạng thái", value: "all" },
  ...Object.entries(videoStatusMeta).map(([value, m]) => ({ label: m.label, value })),
]

const SUMMARY: VideoStatus[] = ["uploaded", "processing", "ready", "archived"]

export default function VideosPage() {
  const counts = videoStatusCounts()
  const [query, setQuery] = React.useState("")
  const [facility, setFacility] = React.useState("all")
  const [status, setStatus] = React.useState("all")
  const [page, setPage] = React.useState(1)
  const [selected, setSelected] = React.useState<VideoAsset | null>(null)
  const [open, setOpen] = React.useState(false)
  const { scopedFacilityId } = useSession()

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return videoAssets.filter((v) => {
      if (scopedFacilityId && v.facilityId !== scopedFacilityId) return false
      if (facility !== "all" && v.facilityId !== facility) return false
      if (status !== "all" && v.status !== status) return false
      if (q && !`${v.sessionCode} ${deviceName(v.deviceId)}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [query, facility, status, scopedFacilityId])

  const columns: Column<VideoAsset>[] = [
    {
      key: "session",
      header: "Session",
      sortable: true,
      sortValue: (v) => v.sessionCode,
      cell: (v) => (
        <div className="flex flex-col">
          <span className="font-mono font-medium">{v.sessionCode}</span>
          <span className="text-xs text-muted-foreground">{facilityName(v.facilityId)}</span>
        </div>
      ),
    },
    {
      key: "collaborator",
      header: "CTV",
      cell: (v) => <span className="text-sm">{collaboratorName(v.collaboratorId)}</span>,
    },
    {
      key: "device",
      header: "Thiết bị",
      cell: (v) => <span className="font-mono text-xs">{deviceName(v.deviceId)}</span>,
    },
    {
      key: "streams",
      header: "Luồng",
      cell: (v) => (
        <div className="flex flex-wrap gap-1">
          {v.streams.map((s) => (
            <Badge key={s} variant="secondary" className="text-[10px]">
              {streamLabels[s] ?? s}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "duration",
      header: "Thời lượng",
      align: "right",
      sortable: true,
      sortValue: (v) => v.durationMin,
      cell: (v) => <span className="text-xs tabular-nums">{formatDuration(v.durationMin)}</span>,
    },
    {
      key: "size",
      header: "Dung lượng",
      align: "right",
      sortable: true,
      sortValue: (v) => v.sizeGb,
      cell: (v) => <span className="text-xs tabular-nums">{formatGb(v.sizeGb)}</span>,
    },
    {
      key: "recorded",
      header: "Thời điểm quay",
      sortable: true,
      sortValue: (v) => v.recordedAt,
      cell: (v) => <span className="text-xs text-muted-foreground">{formatDateTime(v.recordedAt)}</span>,
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      sortValue: (v) => v.status,
      cell: (v) => {
        const m = videoStatusMeta[v.status]
        return <StatusBadge label={m.label} tone={m.tone} pulse={v.status === "processing"} />
      },
    },
  ]

  const { sorted, sortKey, sortDir, toggleSort } = useSortedRows(filtered, columns, "recorded")

  React.useEffect(() => {
    setPage(1)
  }, [query, facility, status, scopedFacilityId])

  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {SUMMARY.map((s) => {
          const m = videoStatusMeta[s]
          return (
            <StatTile
              key={s}
              label={m.label}
              value={counts[s] ?? 0}
              tone={m.tone}
              active={status === s}
              onClick={() => setStatus((prev) => (prev === s ? "all" : s))}
            />
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Tìm theo session, thiết bị..."
          className="w-full sm:w-72"
        />
        {!scopedFacilityId && (
          <FilterSelect value={facility} onChange={setFacility} options={facilityOptions} ariaLabel="Lọc theo cơ sở" className="w-52" />
        )}
        <FilterSelect value={status} onChange={setStatus} options={statusOptions} ariaLabel="Lọc theo trạng thái" className="w-44" />
      </div>

      <DataTable
        columns={columns}
        rows={paged}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={toggleSort}
        activeRowId={open ? selected?.id : null}
        onRowClick={(v) => {
          setSelected(v)
          setOpen(true)
        }}
        emptyMessage="Không tìm thấy video phù hợp"
      />

      <DataPagination page={page} pageSize={PAGE_SIZE} total={sorted.length} onPageChange={setPage} />

      <VideoDetail video={selected} open={open} onOpenChange={setOpen} />
    </div>
  )
}

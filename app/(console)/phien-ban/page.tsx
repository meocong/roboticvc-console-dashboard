"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/session"
import { SearchInput } from "@/components/console/search-input"
import { FilterSelect } from "@/components/console/filter-select"
import { DataPagination } from "@/components/console/data-pagination"
import {
  DataTable,
  useSortedRows,
  type Column,
} from "@/components/console/data-table"
import { StatusBadge } from "@/components/console/status-badge"
import { Meter } from "@/components/console/meter"
import { VersionDetail } from "@/components/console/version-detail"
import { versions } from "@/lib/mock-data"
import { channelMeta, policyMeta } from "@/lib/labels"
import { formatDate } from "@/lib/format"
import type { Version } from "@/lib/types"

const PAGE_SIZE = 10

const channelOptions = [
  { label: "Tất cả kênh", value: "all" },
  { label: "Ổn định", value: "stable" },
  { label: "Beta", value: "beta" },
]

const policyOptions = [
  { label: "Tất cả chính sách", value: "all" },
  { label: "Thủ công", value: "manual" },
  { label: "Tự động", value: "auto" },
  { label: "Bắt buộc", value: "forced" },
]

function rolloutPct(v: Version) {
  if (v.rollout.length === 0) return 0
  return Math.round((v.rollout.filter((r) => r.status === "done").length / v.rollout.length) * 100)
}

export default function VersionsPage() {
  const router = useRouter()
  const { role } = useSession()

  // Phiên bản firmware = toàn hệ thống → chỉ superadmin.
  React.useEffect(() => {
    if (role === "facility_admin") router.replace("/")
  }, [role, router])

  const [query, setQuery] = React.useState("")
  const [channel, setChannel] = React.useState("all")
  const [policy, setPolicy] = React.useState("all")
  const [page, setPage] = React.useState(1)
  const [selected, setSelected] = React.useState<Version | null>(null)
  const [open, setOpen] = React.useState(false)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return versions.filter((v) => {
      if (channel !== "all" && v.channel !== channel) return false
      if (policy !== "all" && v.policy !== policy) return false
      if (q && !v.tag.toLowerCase().includes(q)) return false
      return true
    })
  }, [query, channel, policy])

  const columns: Column<Version>[] = [
    {
      key: "tag",
      header: "Phiên bản",
      sortable: true,
      sortValue: (v) => v.tag,
      cell: (v) => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-medium">{v.tag}</span>
          {v.active && <StatusBadge label="Active" tone="success" />}
        </div>
      ),
    },
    {
      key: "channel",
      header: "Kênh",
      sortable: true,
      sortValue: (v) => v.channel,
      cell: (v) => {
        const m = channelMeta[v.channel]
        return <StatusBadge label={m.label} tone={m.tone} dot={false} />
      },
    },
    {
      key: "policy",
      header: "Chính sách",
      cell: (v) => {
        const m = policyMeta[v.policy]
        return <StatusBadge label={m.label} tone={m.tone} dot={false} />
      },
    },
    {
      key: "rollout",
      header: "Tỉ lệ cập nhật",
      sortable: true,
      sortValue: (v) => rolloutPct(v),
      cell: (v) => {
        const pct = rolloutPct(v)
        return (
          <div className="flex w-36 items-center gap-2">
            <Meter value={pct} tone={pct === 100 ? "success" : "info"} className="flex-1" />
            <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">{pct}%</span>
          </div>
        )
      },
    },
    {
      key: "released",
      header: "Phát hành",
      align: "right",
      sortable: true,
      sortValue: (v) => v.releasedAt,
      cell: (v) => <span className="text-xs text-muted-foreground">{formatDate(v.releasedAt)}</span>,
    },
  ]

  const { sorted, sortKey, sortDir, toggleSort } = useSortedRows(filtered, columns, "released")

  React.useEffect(() => {
    setPage(1)
  }, [query, channel, policy])

  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Tìm theo phiên bản..."
          className="w-full sm:w-64"
        />
        <FilterSelect value={channel} onChange={setChannel} options={channelOptions} ariaLabel="Lọc theo kênh" className="w-44" />
        <FilterSelect value={policy} onChange={setPolicy} options={policyOptions} ariaLabel="Lọc theo chính sách" className="w-48" />
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
        emptyMessage="Không tìm thấy phiên bản phù hợp"
      />

      <DataPagination page={page} pageSize={PAGE_SIZE} total={sorted.length} onPageChange={setPage} />

      <VersionDetail version={selected} open={open} onOpenChange={setOpen} />
    </div>
  )
}

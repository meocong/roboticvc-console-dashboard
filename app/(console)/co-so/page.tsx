"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/console/search-input"
import { FilterSelect } from "@/components/console/filter-select"
import { DataPagination } from "@/components/console/data-pagination"
import {
  DataTable,
  useSortedRows,
  type Column,
} from "@/components/console/data-table"
import { StatusBadge } from "@/components/console/status-badge"
import { useRouter } from "next/navigation"
import { facilities, devices, collaborators } from "@/lib/mock-data"
import { facilityStatusMeta } from "@/lib/labels"
import type { Facility } from "@/lib/types"

const PAGE_SIZE = 8

const regionOptions = [
  { label: "Tất cả khu vực", value: "all" },
  ...Array.from(new Set(facilities.map((f) => f.region))).map((r) => ({
    label: r,
    value: r,
  })),
]

const statusOptions = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Hoạt động", value: "active" },
  { label: "Tạm dừng", value: "paused" },
]

export default function FacilitiesPage() {
  const [query, setQuery] = React.useState("")
  const [region, setRegion] = React.useState("all")
  const [status, setStatus] = React.useState("all")
  const [page, setPage] = React.useState(1)
  const router = useRouter()

  const deviceCount = React.useMemo(() => {
    const map: Record<string, number> = {}
    devices.forEach((d) => {
      map[d.facilityId] = (map[d.facilityId] ?? 0) + 1
    })
    return map
  }, [])

  const collabCount = React.useMemo(() => {
    const map: Record<string, number> = {}
    collaborators.forEach((c) => {
      map[c.facilityId] = (map[c.facilityId] ?? 0) + 1
    })
    return map
  }, [])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return facilities.filter((f) => {
      if (region !== "all" && f.region !== region) return false
      if (status !== "all" && f.status !== status) return false
      if (
        q &&
        !`${f.name} ${f.code} ${f.region} ${f.contactName}`
          .toLowerCase()
          .includes(q)
      )
        return false
      return true
    })
  }, [query, region, status])

  const columns: Column<Facility>[] = [
    {
      key: "name",
      header: "Cơ sở",
      sortable: true,
      sortValue: (f) => f.name,
      cell: (f) => (
        <div className="flex flex-col">
          <span className="font-medium">{f.name}</span>
          <span className="font-mono text-xs text-muted-foreground">{f.code}</span>
        </div>
      ),
    },
    {
      key: "region",
      header: "Khu vực",
      sortable: true,
      sortValue: (f) => f.region,
      cell: (f) => f.region,
    },
    {
      key: "contact",
      header: "Người liên hệ",
      cell: (f) => (
        <div className="flex flex-col">
          <span>{f.contactName}</span>
          <span className="font-mono text-xs text-muted-foreground">
            {f.contactPhone}
          </span>
        </div>
      ),
    },
    {
      key: "devices",
      header: "Thiết bị",
      align: "right",
      sortable: true,
      sortValue: (f) => deviceCount[f.id] ?? 0,
      cell: (f) => (
        <span className="tabular-nums">{deviceCount[f.id] ?? 0}</span>
      ),
    },
    {
      key: "collabs",
      header: "CTV",
      align: "right",
      sortable: true,
      sortValue: (f) => collabCount[f.id] ?? 0,
      cell: (f) => (
        <span className="tabular-nums">{collabCount[f.id] ?? 0}</span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      sortValue: (f) => f.status,
      cell: (f) => {
        const m = facilityStatusMeta[f.status]
        return <StatusBadge label={m.label} tone={m.tone} />
      },
    },
  ]

  const { sorted, sortKey, sortDir, toggleSort } = useSortedRows(
    filtered,
    columns,
    "name",
  )

  React.useEffect(() => {
    setPage(1)
  }, [query, region, status])

  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Tìm cơ sở, mã, người liên hệ..."
            className="w-full sm:w-72"
          />
          <FilterSelect
            value={region}
            onChange={setRegion}
            options={regionOptions}
            ariaLabel="Lọc theo khu vực"
            className="w-40"
          />
          <FilterSelect
            value={status}
            onChange={setStatus}
            options={statusOptions}
            ariaLabel="Lọc theo trạng thái"
            className="w-40"
          />
        </div>
        <Button size="sm">
          <PlusIcon data-icon="inline-start" />
          Thêm cơ sở
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={paged}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={toggleSort}
        onRowClick={(f) => router.push(`/co-so/${f.id}`)}
        emptyMessage="Không tìm thấy cơ sở phù hợp"
      />

      <DataPagination
        page={page}
        pageSize={PAGE_SIZE}
        total={sorted.length}
        onPageChange={setPage}
      />
    </div>
  )
}

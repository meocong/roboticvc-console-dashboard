"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { collaborators, facilities, deviceName } from "@/lib/mock-data"
import { collaboratorStatusMeta } from "@/lib/labels"
import type { Collaborator } from "@/lib/types"

const PAGE_SIZE = 10

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")
}

const facilityOptions = [
  { label: "Tất cả cơ sở", value: "all" },
  ...facilities.map((f) => ({ label: f.name, value: f.id })),
]

const statusOptions = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Đang quay", value: "active" },
  { label: "Nghỉ", value: "off" },
]

export default function CollaboratorsPage() {
  const [query, setQuery] = React.useState("")
  const [facility, setFacility] = React.useState("all")
  const [status, setStatus] = React.useState("all")
  const [page, setPage] = React.useState(1)
  const router = useRouter()

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return collaborators.filter((c) => {
      if (facility !== "all" && c.facilityId !== facility) return false
      if (status !== "all" && c.status !== status) return false
      if (
        q &&
        !`${c.name} ${c.phone} ${c.skills.join(" ")}`.toLowerCase().includes(q)
      )
        return false
      return true
    })
  }, [query, facility, status])

  const columns: Column<Collaborator>[] = [
    {
      key: "name",
      header: "Cộng tác viên",
      sortable: true,
      sortValue: (c) => c.name,
      cell: (c) => (
        <div className="flex items-center gap-2.5">
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {initials(c.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{c.name}</span>
            <span className="font-mono text-xs text-muted-foreground">
              {c.phone}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "skills",
      header: "Kỹ năng",
      cell: (c) => (
        <div className="flex flex-wrap gap-1">
          {c.skills.slice(0, 2).map((s) => (
            <Badge key={s} variant="secondary">
              {s}
            </Badge>
          ))}
          {c.skills.length > 2 && (
            <Badge variant="outline">+{c.skills.length - 2}</Badge>
          )}
        </div>
      ),
    },
    {
      key: "device",
      header: "Thiết bị",
      cell: (c) =>
        c.assignedDeviceId ? (
          <span className="font-mono text-xs">{deviceName(c.assignedDeviceId)}</span>
        ) : (
          <span className="text-xs text-muted-foreground">Chưa gán</span>
        ),
    },
    {
      key: "videos",
      header: "Video",
      align: "right",
      sortable: true,
      sortValue: (c) => c.videosRecorded,
      cell: (c) => <span className="tabular-nums">{c.videosRecorded}</span>,
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      sortValue: (c) => c.status,
      cell: (c) => {
        const m = collaboratorStatusMeta[c.status]
        return (
          <StatusBadge
            label={m.label}
            tone={m.tone}
            pulse={c.status === "active"}
          />
        )
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
  }, [query, facility, status])

  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Tìm theo tên, SĐT, kỹ năng..."
            className="w-full sm:w-72"
          />
          <FilterSelect
            value={facility}
            onChange={setFacility}
            options={facilityOptions}
            ariaLabel="Lọc theo cơ sở"
            className="w-52"
          />
          <FilterSelect
            value={status}
            onChange={setStatus}
            options={statusOptions}
            ariaLabel="Lọc theo trạng thái"
            className="w-44"
          />
        </div>
        <Button size="sm">
          <PlusIcon data-icon="inline-start" />
          Thêm CTV
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={paged}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={toggleSort}
        onRowClick={(c) => router.push(`/cong-tac-vien/${c.id}`)}
        emptyMessage="Không tìm thấy cộng tác viên phù hợp"
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

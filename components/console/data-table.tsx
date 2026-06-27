"use client"

import * as React from "react"
import { ArrowUpDownIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Empty } from "@/components/console/empty-state"

export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  sortValue?: (row: T) => string | number
  cell: (row: T) => React.ReactNode
  className?: string
  headerClassName?: string
  align?: "left" | "right" | "center"
}

export function useSortedRows<T>(
  rows: T[],
  columns: Column<T>[],
  initialKey?: string,
  initialDir: "asc" | "desc" = "asc",
) {
  const [sortKey, setSortKey] = React.useState<string | undefined>(initialKey)
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">(initialDir)

  const toggleSort = React.useCallback((key: string) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"))
        return key
      }
      setSortDir("asc")
      return key
    })
  }, [])

  const sorted = React.useMemo(() => {
    if (!sortKey) return rows
    const col = columns.find((c) => c.key === sortKey)
    if (!col?.sortValue) return rows
    const arr = [...rows]
    arr.sort((a, b) => {
      const av = col.sortValue!(a)
      const bv = col.sortValue!(b)
      if (av < bv) return sortDir === "asc" ? -1 : 1
      if (av > bv) return sortDir === "asc" ? 1 : -1
      return 0
    })
    return arr
  }, [rows, columns, sortKey, sortDir])

  return { sorted, sortKey, sortDir, toggleSort }
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  sortKey,
  sortDir,
  onSort,
  onRowClick,
  activeRowId,
  emptyMessage = "Không có dữ liệu phù hợp",
  selectable = false,
  selectedIds,
  onToggleRow,
  onToggleAll,
}: {
  columns: Column<T>[]
  rows: T[]
  sortKey?: string
  sortDir?: "asc" | "desc"
  onSort?: (key: string) => void
  onRowClick?: (row: T) => void
  activeRowId?: string | null
  emptyMessage?: string
  selectable?: boolean
  selectedIds?: Set<string>
  onToggleRow?: (id: string) => void
  onToggleAll?: (checked: boolean) => void
}) {
  const allChecked = selectable && rows.length > 0 && rows.every((r) => selectedIds?.has(r.id))
  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {selectable && (
              <TableHead className="w-10 pl-4">
                <input
                  type="checkbox"
                  aria-label="Chọn tất cả"
                  className="size-4 cursor-pointer accent-primary align-middle"
                  checked={allChecked}
                  onChange={(e) => onToggleAll?.(e.target.checked)}
                />
              </TableHead>
            )}
            {columns.map((col) => {
              const isActive = sortKey === col.key
              const alignClass =
                col.align === "right"
                  ? "text-right"
                  : col.align === "center"
                    ? "text-center"
                    : "text-left"
              return (
                <TableHead
                  key={col.key}
                  className={cn(
                    "h-9 text-xs font-medium whitespace-nowrap text-muted-foreground",
                    alignClass,
                    col.headerClassName,
                  )}
                >
                  {col.sortable && onSort ? (
                    <button
                      type="button"
                      onClick={() => onSort(col.key)}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-sm transition-colors hover:text-foreground",
                        col.align === "right" && "flex-row-reverse",
                        isActive && "text-foreground",
                      )}
                    >
                      {col.header}
                      {isActive ? (
                        sortDir === "asc" ? (
                          <ArrowUpIcon className="size-3" />
                        ) : (
                          <ArrowDownIcon className="size-3" />
                        )
                      ) : (
                        <ArrowUpDownIcon className="size-3 opacity-40" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length + (selectable ? 1 : 0)} className="h-40 p-0">
                <Empty message={emptyMessage} />
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                data-active={activeRowId === row.id}
                className={cn(
                  onRowClick && "cursor-pointer",
                  "data-[active=true]:bg-accent/60",
                )}
              >
                {selectable && (
                  <TableCell className="w-10 pl-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      aria-label="Chọn dòng"
                      className="size-4 cursor-pointer accent-primary align-middle"
                      checked={selectedIds?.has(row.id) ?? false}
                      onChange={() => onToggleRow?.(row.id)}
                    />
                  </TableCell>
                )}
                {columns.map((col) => {
                  const alignClass =
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                        ? "text-center"
                        : "text-left"
                  return (
                    <TableCell
                      key={col.key}
                      className={cn("py-2.5 text-sm", alignClass, col.className)}
                    >
                      {col.cell(row)}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

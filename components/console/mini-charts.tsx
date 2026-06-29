"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

export interface DonutSlice {
  name: string
  value: number
  color: string
}

export function StatusDonut({ data }: { data: DonutSlice[] }) {
  const slices = data.filter((d) => d.value > 0)
  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="flex items-center gap-5">
      <div className="relative size-[124px] shrink-0">
        {total > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                dataKey="value"
                nameKey="name"
                innerRadius={44}
                outerRadius={60}
                paddingAngle={slices.length > 1 ? 2 : 0}
                strokeWidth={0}
                startAngle={90}
                endAngle={-270}
              >
                {slices.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex size-full items-center justify-center rounded-full border-[10px] border-muted" />
        )}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tabular-nums">{total}</span>
          <span className="text-[10px] text-muted-foreground">Tổng</span>
        </div>
      </div>
      <ul className="flex flex-1 flex-col gap-1.5 text-sm">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2">
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
            <span className="text-muted-foreground">{d.name}</span>
            <span className="ml-auto font-semibold tabular-nums">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

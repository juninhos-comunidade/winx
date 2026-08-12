import { useMemo, useState } from "react"
import { Download, Eye, Search } from "lucide-react"

import { Badge, Card } from "@/components/app-primitives"
import { C, recentSessions } from "@/lib/mock-data"

export function HistoryPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const histData = useMemo(
    () => [
      ...recentSessions,
      ...recentSessions.map((s, i) => ({
        ...s,
        id: s.id + 10,
        date: `0${9 + i}/07/2026`,
      })),
    ],
    []
  )
  const filtered = histData.filter((s) => {
    const matchSearch =
      s.stack.toLowerCase().includes(search.toLowerCase()) ||
      s.date.includes(search)
    const matchFilter =
      filter === "all" ||
      (filter === "good" && s.accuracy >= 85) ||
      (filter === "bad" && s.accuracy < 70)
    return matchSearch && matchFilter
  })

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-48 flex-1 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
          <Search size={14} className="shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar sessões..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
          />
        </div>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {[
            ["all", "Todos"],
            ["good", "Bons"],
            ["bad", "Ruins"],
          ].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className="rounded-md px-3 py-1 text-xs font-medium transition-all"
              style={{
                background: filter === v ? C.pink : "transparent",
                color: filter === v ? "white" : "#6b6378",
              }}
            >
              {l}
            </button>
          ))}
        </div>
        <button
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all"
          style={{ background: `${C.pink}18`, color: C.pink }}
        >
          <Download size={14} /> Excel
        </button>
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: C.border }}>
                {[
                  "Data",
                  "Stack",
                  "Cards",
                  "Acerto",
                  "Tempo",
                  "Pontos",
                  "",
                ].map((h, i) => (
                  <th
                    key={i}
                    className="px-5 py-3 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, idx) => (
                <tr
                  key={`${s.id}-${idx}`}
                  className="border-b transition-colors last:border-0 hover:bg-muted/20"
                  style={{ borderColor: C.border }}
                >
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                    {s.date}
                  </td>
                  <td className="px-5 py-3 font-medium">{s.stack}</td>
                  <td className="px-5 py-3">{s.cards}</td>
                  <td className="px-5 py-3">
                    <Badge
                      variant={
                        s.accuracy >= 85
                          ? "success"
                          : s.accuracy >= 70
                            ? "warning"
                            : "danger"
                      }
                    >
                      {s.accuracy}%
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{s.time}</td>
                  <td
                    className="px-5 py-3 font-semibold"
                    style={{ color: C.pink }}
                  >
                    {s.points}
                  </td>
                  <td className="px-5 py-3">
                    <button className="text-muted-foreground transition-colors hover:text-foreground">
                      <Eye size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="border-t px-5 py-3 text-xs text-muted-foreground"
          style={{ borderColor: C.border }}
        >
          {filtered.length} sessões encontradas
        </div>
      </Card>
    </div>
  )
}

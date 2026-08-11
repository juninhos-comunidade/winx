import { useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ChevronLeft, ChevronRight, Download, Filter } from "lucide-react"

import { Badge, Card, CustomTooltip, StatCard } from "@/components/app-primitives"
import {
  C,
  barData,
  dashboardStats,
  donutData,
  heatColor,
  heatmapData,
  lineData,
  recentSessions,
} from "@/lib/mock-data"

export function DashboardPage() {
  const [sessionPage, setSessionPage] = useState(0)
  const perPage = 4
  const pages = Math.ceil(recentSessions.length / perPage)
  const visible = recentSessions.slice(
    sessionPage * perPage,
    sessionPage * perPage + perPage
  )

  return (
    <div className="max-w-7xl space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Taxa de Acerto
              </h3>
              <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
            </div>
            <Badge variant="pink">+3%</Badge>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis
                dataKey="day"
                tick={{ fill: "#6b6378", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[60, 100]}
                tick={{ fill: "#6b6378", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="acc"
                stroke={C.pink}
                strokeWidth={2}
                dot={{ fill: C.pink, r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: C.pinkLight }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Distribuição
            </h3>
            <p className="text-xs text-muted-foreground">Por dificuldade</p>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={55}
                dataKey="value"
                paddingAngle={2}
              >
                {donutData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {donutData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: d.color }}
                />
                <span className="text-muted-foreground">{d.name}</span>
                <span
                  className="ml-auto font-medium"
                  style={{ color: d.color }}
                >
                  {d.value}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Revisões por Stack
            </h3>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={barData} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis
                dataKey="stack"
                tick={{ fill: "#6b6378", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6b6378", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="reviews" fill={C.pink} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Constância
              </h3>
              <p className="text-xs text-muted-foreground">
                Últimas 52 semanas
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
              Menos
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ background: `${C.pink}90` }}
              />
              Mais
            </div>
          </div>
          <div className="flex gap-0.5 overflow-x-auto pb-1">
            {heatmapData.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((val, di) => (
                  <div
                    key={di}
                    className="h-2.5 w-2.5 cursor-default rounded-sm transition-transform hover:scale-125"
                    style={{ background: heatColor(val) }}
                    title={`${val} sessões`}
                  />
                ))}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-0">
        <div
          className="flex items-center justify-between border-b p-5"
          style={{ borderColor: C.border }}
        >
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Sessões Recentes
            </h3>
            <p className="text-xs text-muted-foreground">
              {recentSessions.length} sessões
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
              <Filter size={12} /> Filtrar
            </button>
            <button
              className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors"
              style={{ color: C.pink, borderColor: `${C.pink}40` }}
            >
              <Download size={12} /> Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: C.border }}>
                {["Data", "Stack", "Cards", "Acerto", "Tempo", "Pontos"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {visible.map((s) => (
                <tr
                  key={s.id}
                  className="border-b transition-colors last:border-0 hover:bg-muted/30"
                  style={{ borderColor: C.border }}
                >
                  <td className="px-5 py-3 text-xs text-muted-foreground">
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
                  <td className="px-5 py-3">
                    <span className="font-semibold" style={{ color: C.pink }}>
                      {s.points}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3">
          <p className="text-xs text-muted-foreground">
            Página {sessionPage + 1} de {pages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={sessionPage === 0}
              onClick={() => setSessionPage((p) => p - 1)}
              className="rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              disabled={sessionPage === pages - 1}
              onClick={() => setSessionPage((p) => p + 1)}
              className="rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}

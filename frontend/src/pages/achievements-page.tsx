import { Flame } from "lucide-react"

import { Badge,Card, ProgressBar } from "@/components/app-primitives"
import { achievements, C, mockUser } from "@/lib/mock-data"

export function AchievementsPage() {
  const unlocked = achievements.filter((a) => a.unlocked).length
  const streakDays = Array.from({ length: 35 }, (_, i) => {
    const d = 34 - i
    return d < 23 ? (Math.random() > 0.1 ? 1 : 0) : Math.random() > 0.65 ? 1 : 0
  })

  return (
    <div className="max-w-5xl space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="py-6 text-center">
          <p
            className="text-3xl font-bold"
            style={{ color: C.pink, fontFamily: "Roboto, sans-serif" }}
          >
            {unlocked}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Conquistadas</p>
        </Card>
        <Card className="py-6 text-center">
          <p
            className="text-3xl font-bold"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            {achievements.length - unlocked}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Bloqueadas</p>
        </Card>
        <Card className="py-6 text-center">
          <p
            className="text-3xl font-bold"
            style={{ color: "#f97316", fontFamily: "Roboto, sans-serif" }}
          >
            {mockUser.streak}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Dias seguidos</p>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3
            className="text-sm font-semibold text-foreground"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            Calendário de streak
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Flame size={12} style={{ color: "#f97316" }} /> {mockUser.streak}{" "}
            dias consecutivos
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {streakDays.map((active, i) => (
            <div
              key={i}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-medium transition-transform hover:scale-110"
              style={{
                background: active ? `${C.pink}25` : "rgba(255,255,255,0.04)",
                color: active ? C.pinkLight : "#6b6378",
              }}
            >
              {active ? "🔥" : "·"}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-6 text-xs text-muted-foreground">
          <span>
            <span className="font-bold text-green-400">7 dias</span> — Semana
            perfeita
          </span>
          <span>
            <span className="font-bold" style={{ color: C.pink }}>
              30 dias
            </span>{" "}
            — Mês dedicado
          </span>
          <span>
            <span className="font-bold text-yellow-400">100 dias</span> —
            Lendário
          </span>
        </div>
      </Card>

      <div>
        <h3
          className="mb-4 text-sm font-semibold text-foreground"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          Conquistas
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {achievements.map((a) => (
            <Card
              key={a.id}
              className={`text-center transition-all ${!a.unlocked ? "opacity-50" : "hover:border-muted-foreground/20"}`}
            >
              <div
                className={`mb-2 text-3xl ${!a.unlocked ? "grayscale" : ""}`}
              >
                {a.icon}
              </div>
              <p
                className="mb-0.5 text-sm font-semibold text-foreground"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {a.name}
              </p>
              <p className="mb-3 text-xs text-muted-foreground">{a.desc}</p>
              {a.unlocked ? (
                <Badge variant="success">Desbloqueada</Badge>
              ) : (
                <div className="space-y-1.5">
                  <ProgressBar value={a.progress} color={C.mauve} />
                  <p className="text-xs text-muted-foreground">{a.progress}%</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

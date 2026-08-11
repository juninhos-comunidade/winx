import { useState } from "react"
import { RotateCcw, Flame } from "lucide-react"

import { Avatar, Card } from "@/components/app-primitives"
import { C, rankingUsers } from "@/lib/mock-data"

export function RankingPage() {
  const [tab, setTab] = useState("global")
  const top3 = rankingUsers.slice(0, 3)
  const rest = rankingUsers.slice(3)
  const podiumOrder = [top3[1], top3[0], top3[2]]
  const podiumHeights = [96, 128, 80]
  const podiumColors = [C.mauve, C.warning, C.lavender]
  const medals = ["🥈", "🥇", "🥉"]

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex w-fit gap-1 rounded-xl bg-muted p-1">
        {["global", "amigos", "stack"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-all"
            style={{
              background: tab === t ? C.pink : "transparent",
              color: tab === t ? "white" : "#6b6378",
            }}
          >
            {t === "stack"
              ? "Por stack"
              : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <Card>
        <div className="flex items-end justify-center gap-4 pt-4 pb-2">
          {podiumOrder.map((user, i) => (
            <div key={user.pos} className="flex flex-col items-center gap-2">
              <span className="text-xl">{medals[i]}</span>
              <Avatar
                initials={user.initials}
                size={i === 1 ? "lg" : "md"}
                color={user.avatar}
              />
              <p className="max-w-16 truncate text-center text-xs font-medium text-foreground">
                {user.name.split(" ")[0]}
              </p>
              <p
                className="text-xs font-bold"
                style={{ color: podiumColors[i] }}
              >
                {user.points.toLocaleString()}
              </p>
              <div
                className="flex w-16 items-center justify-center rounded-t-lg text-xs font-bold text-white/70"
                style={{
                  height: podiumHeights[i],
                  background: `${podiumColors[i]}25`,
                  border: `1px solid ${podiumColors[i]}40`,
                }}
              >
                #{podiumOrder[i].pos}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-0">
        <div className="divide-y" style={{ borderColor: C.border }}>
          {rest.map((user) => (
            <div
              key={user.pos}
              className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-muted/20"
              style={
                user.isMe
                  ? {
                      background: `${C.pink}08`,
                      borderLeft: `2px solid ${C.pink}`,
                    }
                  : undefined
              }
            >
              <span className="w-6 text-right text-sm font-bold text-muted-foreground">
                {user.pos}
              </span>
              <Avatar initials={user.initials} size="sm" color={user.avatar} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {user.name}
                  {user.isMe && (
                    <span className="ml-1.5 text-xs" style={{ color: C.pink }}>
                      você
                    </span>
                  )}
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Flame size={10} style={{ color: C.pink }} /> {user.streak}{" "}
                  dias
                </p>
              </div>
              <p
                className="text-sm font-bold"
                style={{ color: user.isMe ? C.pink : "inherit" }}
              >
                {user.points.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <RotateCcw size={12} />
        Reset automático toda segunda-feira · 00:00
      </div>
    </div>
  )
}


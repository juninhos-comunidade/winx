import { useEffect, useRef, useState } from "react"
import { Clock, Eye, RotateCcw } from "lucide-react"

import { Badge, Card, ProgressBar } from "@/components/app-primitives"
import { C, reviewCards } from "@/lib/mock-data"

export function ReviewPage() {
  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [results, setResults] = useState<("wrong" | "hard" | "right" | "easy")[]>(
    []
  )
  const [done, setDone] = useState(false)
  const [timer, setTimer] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (done) return
    intervalRef.current = setInterval(() => setTimer((t) => t + 1), 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [cardIndex, done])

  useEffect(() => {
    setTimer(0)
  }, [cardIndex])

  const card = reviewCards[cardIndex]
  const total = reviewCards.length

  function answer(rating: "wrong" | "hard" | "right" | "easy") {
    const newResults = [...results, rating]
    setResults(newResults)
    setTotalTime((t) => t + timer)
    if (cardIndex + 1 >= total) {
      setDone(true)
    } else {
      setCardIndex((i) => i + 1)
      setFlipped(false)
    }
  }

  function restart() {
    setCardIndex(0)
    setFlipped(false)
    setResults([])
    setDone(false)
    setTimer(0)
    setTotalTime(0)
  }

  if (done) {
    const correct = results.filter((r) => r === "right" || r === "easy").length
    const acc = Math.round((correct / total) * 100)
    const avgTime = Math.round(totalTime / total)
    const points = correct * 10 + results.filter((r) => r === "easy").length * 5

    return (
      <div className="mx-auto max-w-lg">
        <Card className="py-10 text-center">
          <div className="mb-4 text-4xl">🎉</div>
          <h2
            className="mb-1 text-2xl font-bold"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            Sessão concluída!
          </h2>
          <p className="mb-8 text-sm text-muted-foreground">
            Anatomia · {total} cards
          </p>
          <div className="mb-8 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted p-4">
              <p
                className="text-3xl font-bold"
                style={{ color: C.success, fontFamily: "Roboto, sans-serif" }}
              >
                {acc}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Taxa de acerto
              </p>
            </div>
            <div className="rounded-xl bg-muted p-4">
              <p
                className="text-3xl font-bold"
                style={{ color: C.pink, fontFamily: "Roboto, sans-serif" }}
              >
                {points}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Pontos ganhos
              </p>
            </div>
            <div className="rounded-xl bg-muted p-4">
              <p
                className="text-3xl font-bold"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {avgTime}s
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Tempo médio</p>
            </div>
            <div className="rounded-xl bg-muted p-4">
              <p
                className="text-3xl font-bold"
                style={{ color: C.mauve, fontFamily: "Roboto, sans-serif" }}
              >
                +2
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Posições no ranking
              </p>
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={restart}
              className="flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              <RotateCcw size={14} /> Repetir
            </button>
            <button
              className="rounded-lg px-6 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: C.pink }}
            >
              Próximo stack
            </button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Anatomia</span>
          <span>
            {cardIndex + 1} / {total}
          </span>
        </div>
        <ProgressBar value={(cardIndex / total) * 100} />
        <div className="flex gap-1">
          {reviewCards.map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all"
              style={{
                background:
                  i < results.length
                    ? results[i] === "easy" || results[i] === "right"
                      ? C.success
                      : results[i] === "hard"
                        ? C.warning
                        : C.danger
                    : i === cardIndex
                      ? C.pink
                      : "rgba(255,255,255,0.08)",
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <div
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
          style={{ fontFamily: "JetBrains Mono, monospace" }}
        >
          <Clock size={12} />
          {timer}s
        </div>
      </div>

      <div
        className="card-flip h-64 cursor-pointer"
        onClick={() => setFlipped((f) => !f)}
      >
        <div className={`card-flip-inner h-full ${flipped ? "flipped" : ""}`}>
          <div className="card-face absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center">
            <div className="absolute top-4 left-4">
              <Badge>Pergunta</Badge>
            </div>
            <p
              className="text-lg leading-relaxed font-medium text-foreground"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {card.q}
            </p>
            <p className="absolute bottom-4 flex items-center gap-1 text-xs text-muted-foreground">
              <Eye size={12} /> Clique para revelar
            </p>
          </div>
          <div
            className="card-face card-back absolute inset-0 flex flex-col items-center justify-center rounded-2xl p-8 text-center"
            style={{
              background: "linear-gradient(135deg, #1a1728 0%, #1e1b2e 100%)",
              border: `1px solid ${C.pink}30`,
            }}
          >
            <div className="absolute top-4 left-4">
              <Badge variant="pink">Resposta</Badge>
            </div>
            <p className="text-sm leading-relaxed text-foreground">{card.a}</p>
          </div>
        </div>
      </div>

      {flipped ? (
        <div className="grid grid-cols-4 gap-3">
          {[
            {
              label: "Errei",
              rating: "wrong" as const,
              color: C.danger,
              bg: `${C.danger}15`,
              key: "1",
            },
            {
              label: "Difícil",
              rating: "hard" as const,
              color: C.warning,
              bg: `${C.warning}15`,
              key: "2",
            },
            {
              label: "Acertei",
              rating: "right" as const,
              color: C.success,
              bg: `${C.success}15`,
              key: "3",
            },
            {
              label: "Fácil",
              rating: "easy" as const,
              color: C.pinkLight,
              bg: `${C.pink}20`,
              key: "4",
            },
          ].map(({ label, rating, color, bg, key }) => (
            <button
              key={rating}
              onClick={() => answer(rating)}
              className="flex flex-col items-center gap-1.5 rounded-xl border py-3 text-sm font-medium transition-all hover:scale-105"
              style={{ color, background: bg, borderColor: `${color}30` }}
            >
              {label}
              <span className="font-mono text-xs opacity-50">[{key}]</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <button
            onClick={() => setFlipped(true)}
            className="rounded-xl px-8 py-3 font-semibold text-white transition-all hover:scale-105 hover:opacity-90"
            style={{ background: C.pink }}
          >
            Revelar resposta{" "}
            <span className="ml-2 text-xs opacity-60">[Espaço]</span>
          </button>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Atalhos:{" "}
        <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
          Espaço
        </kbd>{" "}
        revelar ·{" "}
        <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
          1–4
        </kbd>{" "}
        avaliar
      </p>
    </div>
  )
}

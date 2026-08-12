import { useEffect, useMemo } from "react"
import { Eye, RotateCcw } from "lucide-react"

import {
  Badge,
  Card,
  ProgressBar,
  formatTimer,
} from "@/components/app-primitives"
import { C } from "@/lib/theme"
import { useCategoryStore } from "@/stores/category-store"
import { useCardStore } from "@/stores/card-store"
import { useReviewStore } from "@/stores/review-store"

const ratingMap = [
  {
    key: "1",
    label: "Errei",
    rating: "wrong" as const,
    color: C.danger,
    bg: `${C.danger}15`,
  },
  {
    key: "2",
    label: "Difícil",
    rating: "hard" as const,
    color: C.warning,
    bg: `${C.warning}15`,
  },
  {
    key: "3",
    label: "Acertei",
    rating: "right" as const,
    color: C.success,
    bg: `${C.success}15`,
  },
  {
    key: "4",
    label: "Fácil",
    rating: "easy" as const,
    color: C.pinkLight,
    bg: `${C.pink}20`,
  },
]

export function ReviewPage() {
  const { categories, selectedCategoryId, selectCategory } = useCategoryStore()
  const cards = useCardStore((state) => state.cards)
  const {
    categoryId,
    currentIndex,
    flipped,
    done,
    elapsedSeconds,
    results,
    startSession,
    toggleFlip,
    answer,
    tick,
  } = useReviewStore()

  const activeCategory =
    categories.find((category) => category.id === selectedCategoryId) ??
    categories[0] ??
    null

  const sessionCategory =
    categories.find((category) => category.id === categoryId) ?? activeCategory

  const availableCategory =
    categories.find((category) =>
      cards.some((card) => card.categoryId === category.id)
    ) ?? null

  const sessionCards = useMemo(() => {
    if (!categoryId) return []
    return cards.filter((card) => card.categoryId === categoryId)
  }, [cards, categoryId])

  const currentCard = sessionCards[currentIndex] ?? null
  const total = sessionCards.length

  useEffect(() => {
    if (!categoryId || done) return

    const timer = window.setInterval(() => tick(), 1000)
    return () => window.clearInterval(timer)
  }, [categoryId, done, tick])

  useEffect(() => {
    if (!categories.length) return
    if (!selectedCategoryId && categories[0]) {
      selectCategory(categories[0].id)
    }
  }, [categories, selectCategory, selectedCategoryId])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!categoryId || done) return

      if (event.code === "Space") {
        event.preventDefault()
        toggleFlip()
        return
      }

      const keyMap = ratingMap.find((item) => item.key === event.key)
      if (!keyMap || !flipped) return

      event.preventDefault()
      answer(keyMap.rating)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [answer, categoryId, done, flipped, toggleFlip])

  function startCurrentSession() {
    let targetCategory = availableCategory
    if (
      activeCategory &&
      cards.some((card) => card.categoryId === activeCategory.id)
    ) {
      targetCategory = activeCategory
    }

    if (!targetCategory) return

    const nextCards = cards.filter(
      (card) => card.categoryId === targetCategory.id
    )
    startSession(
      targetCategory.id,
      nextCards.map((card) => card.id)
    )
  }

  function restartCurrentSession() {
    if (!sessionCategory) return
    const nextCards = cards.filter(
      (card) => card.categoryId === sessionCategory.id
    )
    startSession(
      sessionCategory.id,
      nextCards.map((card) => card.id)
    )
  }

  if (!categories.length) {
    return (
      <div className="mx-auto max-w-xl">
        <Card className="space-y-4 text-center">
          <div className="text-4xl">📚</div>
          <h2 className="text-2xl font-bold text-foreground">Sem categorias</h2>
          <p className="text-sm text-muted-foreground">
            Crie uma categoria e adicione cartas antes de iniciar a revisão.
          </p>
        </Card>
      </div>
    )
  }

  if (!categoryId || total === 0) {
    const hasAnyCards = cards.length > 0
    const canStart = Boolean(availableCategory)

    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Card className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Preparar sessão
              </h2>
              <p className="text-sm text-muted-foreground">
                Escolha uma categoria com cartas cadastradas.
              </p>
            </div>
            <Badge variant="pink">
              {categories.length} categorias cadastradas
            </Badge>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-3">
              {categories.map((category) => {
                const count = cards.filter(
                  (card) => card.categoryId === category.id
                ).length
                const disabled = count === 0
                return (
                  <button
                    key={category.id}
                    disabled={disabled}
                    onClick={() => selectCategory(category.id)}
                    className="flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors hover:border-muted-foreground/30 disabled:cursor-not-allowed disabled:opacity-40"
                    style={
                      selectedCategoryId === category.id
                        ? {
                            borderColor: category.color,
                            background: `${category.color}10`,
                          }
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                        style={{ background: `${category.color}20` }}
                      >
                        {category.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {category.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {count} cartas
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {disabled ? "Sem cartas" : "Selecionar"}
                    </span>
                  </button>
                )
              })}
            </div>

            <Card className="space-y-3">
              <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Modelo de uso
              </p>
              <p className="text-sm text-muted-foreground">
                1. Selecione uma categoria.
                <br />
                2. Inicie a sessão.
                <br />
                3. Espaço revela, `1` a `4` respondem.
              </p>
              <button
                onClick={startCurrentSession}
                disabled={!canStart}
                className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: C.pink }}
              >
                Iniciar revisão
              </button>
            </Card>
          </div>

          {!hasAnyCards && (
            <p className="text-sm text-muted-foreground">
              Nenhuma carta cadastrada ainda.
            </p>
          )}
        </Card>
      </div>
    )
  }

  if (done) {
    const correct = results.filter(
      (result) => result === "right" || result === "easy"
    ).length
    const accuracy = total === 0 ? 0 : Math.round((correct / total) * 100)
    const easyCount = results.filter((result) => result === "easy").length
    const points = correct * 10 + easyCount * 5

    return (
      <div className="mx-auto max-w-2xl">
        <Card className="space-y-6 text-center">
          <div className="text-4xl">✅</div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Sessão concluída
            </h2>
            <p className="text-sm text-muted-foreground">
              {sessionCategory?.name} · {total} cartas
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted p-4">
              <p className="text-3xl font-bold" style={{ color: C.success }}>
                {accuracy}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Precisão</p>
            </div>
            <div className="rounded-xl bg-muted p-4">
              <p className="text-3xl font-bold" style={{ color: C.pink }}>
                {points}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Pontos</p>
            </div>
            <div className="rounded-xl bg-muted p-4">
              <p className="text-3xl font-bold text-foreground">
                {Math.round(elapsedSeconds / Math.max(total, 1))}s
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Média</p>
            </div>
            <div className="rounded-xl bg-muted p-4">
              <p className="text-3xl font-bold" style={{ color: C.mauve }}>
                {results.length}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Respostas</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={restartCurrentSession}
              className="flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              <RotateCcw size={14} /> Repetir
            </button>
            <button
              onClick={() => {
                if (sessionCategory) {
                  startSession(
                    sessionCategory.id,
                    sessionCards.map((card) => card.id)
                  )
                }
              }}
              className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: C.pink }}
            >
              Nova rodada
            </button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{sessionCategory?.name}</span>
          <span>
            {currentIndex + 1} / {total}
          </span>
        </div>
        <ProgressBar value={(currentIndex / Math.max(total, 1)) * 100} />
      </div>

      <div className="flex items-center justify-between">
        <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
          Espaço revela, `1` a `4` respondem
        </div>
        {formatTimer(elapsedSeconds)}
      </div>

      <div
        className="card-flip h-72 cursor-pointer"
        onClick={() => toggleFlip()}
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
              {currentCard?.question}
            </p>
            <p className="absolute bottom-4 flex items-center gap-1 text-xs text-muted-foreground">
              <Eye size={12} /> Clique ou pressione espaço
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
            <p className="text-sm leading-relaxed text-foreground">
              {currentCard?.answer}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {ratingMap.map(({ label, rating, color, bg, key }) => (
          <button
            key={rating}
            onClick={() => {
              if (flipped) {
                answer(rating)
              }
            }}
            className="flex flex-col items-center gap-1.5 rounded-xl border py-3 text-sm font-medium transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
            style={{ color, background: bg, borderColor: `${color}30` }}
            disabled={!flipped}
          >
            {label}
            <span className="font-mono text-xs opacity-50">[{key}]</span>
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => toggleFlip()}
          className="rounded-xl px-8 py-3 font-semibold text-white transition-all hover:scale-105 hover:opacity-90"
          style={{ background: C.pink }}
        >
          {flipped ? "Voltar para pergunta" : "Revelar resposta"}
        </button>
      </div>
    </div>
  )
}

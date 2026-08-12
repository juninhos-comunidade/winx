import { useEffect, useMemo, useState } from "react"
import { ArrowRight, Plus, Search, Trash2 } from "lucide-react"

import { Card, Badge, ProgressBar } from "@/components/app-primitives"
import { C } from "@/lib/theme"
import { useCategoryStore } from "@/stores/category-store"
import { useCardStore } from "@/stores/card-store"

const CARD_IMPORT_TEMPLATE = {
  cards: [
    {
      question: "Qual é o conceito principal desta categoria?",
      answer: "Explique aqui a resposta base.",
      tags: ["tag1", "tag2"],
      difficulty: "normal",
    },
    {
      question: "Outra carta exemplo?",
      answer: "Sim, e pode vir em lotes infinitos por JSON.",
      tags: ["importado"],
      difficulty: "easy",
    },
  ],
}

const DEFAULT_JSON_MODEL = JSON.stringify(CARD_IMPORT_TEMPLATE, null, 2)

type ImportPayload = {
  cards?: Array<{
    question?: string
    answer?: string
    tags?: string[] | string
    difficulty?: "easy" | "normal" | "hard"
    prompt?: string
    response?: string
    front?: string
    back?: string
    title?: string
    id?: string | number
  }>
  items?: ImportPayload["cards"]
  flashcards?: ImportPayload["cards"]
  cardsData?: ImportPayload["cards"]
  category?: string
  categoryName?: string
  category_id?: string
}

export function StacksPage() {
  const {
    categories,
    selectedCategoryId,
    createCategory,
    selectCategory,
    deleteCategory,
  } = useCategoryStore()
  const { cards, addCard, addCards, deleteCardsByCategory } = useCardStore()

  const [search, setSearch] = useState("")
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    icon: "📚",
    color: C.pink,
    description: "",
  })
  const [cardForm, setCardForm] = useState({
    question: "",
    answer: "",
    tags: "",
    difficulty: "normal" as "easy" | "normal" | "hard",
  })
  const [jsonModel, setJsonModel] = useState(DEFAULT_JSON_MODEL)
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedCategoryId && categories[0]) {
      selectCategory(categories[0].id)
    }
  }, [categories, selectCategory, selectedCategoryId])

  const visibleCategories = useMemo(
    () =>
      categories.filter(
        (category) =>
          category.name.toLowerCase().includes(search.toLowerCase()) ||
          category.description.toLowerCase().includes(search.toLowerCase())
      ),
    [categories, search]
  )

  const selectedCategory =
    categories.find((category) => category.id === selectedCategoryId) ??
    categories[0] ??
    null

  const selectedCards = cards.filter(
    (card) => card.categoryId === selectedCategory?.id
  )

  function stripCodeFences(text: string) {
    const trimmed = text.trim()
    if (trimmed.startsWith("```")) {
      return trimmed
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/```$/i, "")
        .trim()
    }
    return trimmed
  }

  function normalizeDifficulty(value: unknown) {
    const normalized = String(value ?? "normal")
      .trim()
      .toLowerCase()

    if (["easy", "fácil", "facil", "leve", "1"].includes(normalized))
      return "easy"
    if (["hard", "difícil", "dificil", "pesada", "3"].includes(normalized))
      return "hard"
    return "normal"
  }

  function normalizeTags(tags: unknown) {
    if (Array.isArray(tags)) {
      return tags.map((tag) => String(tag).trim()).filter(Boolean)
    }

    if (typeof tags === "string") {
      return tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    }

    return []
  }

  function extractCardSource(value: unknown) {
    if (!value || typeof value !== "object") return null
    const item = value as Record<string, unknown>
    const question =
      item.question ?? item.prompt ?? item.front ?? item.title ?? item.frente
    const answer = item.answer ?? item.response ?? item.back ?? item.resposta

    if (typeof question !== "string" || typeof answer !== "string") return null

    return {
      question,
      answer,
      tags: normalizeTags(item.tags),
      difficulty: normalizeDifficulty(item.difficulty),
    }
  }

  function extractItems(parsed: unknown) {
    if (Array.isArray(parsed)) return parsed
    if (!parsed || typeof parsed !== "object") return []

    const payload = parsed as ImportPayload & Record<string, unknown>
    const candidates =
      payload.cards ??
      payload.items ??
      payload.flashcards ??
      payload.cardsData ??
      null

    if (Array.isArray(candidates)) return candidates

    const single = extractCardSource(payload)
    return single ? [single] : []
  }

  function onCreateCategory() {
    if (!categoryForm.name.trim()) {
      setFeedback("Informe o nome da categoria.")
      return
    }

    createCategory(categoryForm)
    setCategoryForm({
      name: "",
      icon: "📚",
      color: C.pink,
      description: "",
    })
    setFeedback("Categoria criada.")
  }

  function onCreateCard() {
    if (!selectedCategory) {
      setFeedback("Crie ou selecione uma categoria primeiro.")
      return
    }

    if (!cardForm.question.trim() || !cardForm.answer.trim()) {
      setFeedback("Pergunta e resposta são obrigatórias.")
      return
    }

    addCard({
      categoryId: selectedCategory.id,
      question: cardForm.question,
      answer: cardForm.answer,
      tags: cardForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      difficulty: cardForm.difficulty,
      source: "manual",
    })

    setCardForm({
      question: "",
      answer: "",
      tags: "",
      difficulty: "normal",
    })
    setFeedback("Carta adicionada manualmente.")
  }

  function onImportJson() {
    if (!selectedCategory) {
      setFeedback("Crie ou selecione uma categoria primeiro.")
      return
    }

    try {
      const parsed: unknown = JSON.parse(stripCodeFences(jsonModel))
      const items = extractItems(parsed)

      const mapped = items
        .map((item) => extractCardSource(item))
        .filter(
          (item): item is NonNullable<ReturnType<typeof extractCardSource>> =>
            Boolean(item)
        )
        .map((item) => ({
          categoryId: selectedCategory.id,
          question: item.question.trim(),
          answer: item.answer.trim(),
          tags: item.tags,
          difficulty: item.difficulty as "easy" | "normal" | "hard",
          source: "json" as const,
        }))
        .filter((item) => item.question && item.answer)

      if (mapped.length === 0) {
        setFeedback("O JSON não contém cartas válidas.")
        return
      }

      addCards(mapped)
      setFeedback(`${mapped.length} cartas importadas via JSON.`)
    } catch {
      setFeedback("JSON inválido.")
    }
  }

  function resetJsonModel() {
    setJsonModel(DEFAULT_JSON_MODEL)
    setFeedback("Modelo resetado para o padrão.")
  }

  function onDeleteCategory(categoryId: string) {
    deleteCategory(categoryId)
    deleteCardsByCategory(categoryId)
    setFeedback("Categoria removida.")
  }

  return (
    <div className="max-w-9xl space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-48 flex-1 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
          <Search size={14} className="shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar categorias..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
          />
        </div>
        <div className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground">
          {categories.length} categorias
        </div>
        <div className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground">
          {cards.length} cartas
        </div>
      </div>

      {feedback && (
        <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          {feedback}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Nova categoria
            </h3>
            <p className="text-xs text-muted-foreground">
              Organize conjuntos de cartas por tema.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Nome
              </label>
              <input
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm((current) => ({
                    ...current,
                    name: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none"
                placeholder="Ex.: Anatomia"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Ícone
              </label>
              <input
                value={categoryForm.icon}
                onChange={(e) =>
                  setCategoryForm((current) => ({
                    ...current,
                    icon: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none"
                placeholder="📚"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Cor
              </label>
              <input
                type="color"
                value={categoryForm.color}
                onChange={(e) =>
                  setCategoryForm((current) => ({
                    ...current,
                    color: e.target.value,
                  }))
                }
                className="h-10 w-full rounded-lg border border-border bg-muted p-1"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Descrição
              </label>
              <input
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm((current) => ({
                    ...current,
                    description: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none"
                placeholder="Opcional"
              />
            </div>
          </div>

          <button
            onClick={onCreateCategory}
            className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: C.pink }}
          >
            <Plus size={14} /> Criar categoria
          </button>
        </Card>

        <Card className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Importação JSON
              </h3>
              <p className="text-xs text-muted-foreground">
                Cole a saída de uma IA ou um payload do seu back.
              </p>
            </div>
            <button
              onClick={resetJsonModel}
              className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Resetar modelo
            </button>
          </div>

          <textarea
            value={jsonModel}
            onChange={(e) => setJsonModel(e.target.value)}
            rows={12}
            className="w-full rounded-xl border border-border bg-muted px-3 py-3 font-mono text-xs text-foreground outline-none"
          />

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onImportJson}
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: C.pink }}
            >
              Importar JSON <ArrowRight size={14} />
            </button>
            <p className="text-xs text-muted-foreground">
              {"Estrutura aceita: {cards: [...]} ou uma lista direta."}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Categorias
              </h3>
              <p className="text-xs text-muted-foreground">
                Selecione a categoria ativa.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {visibleCategories.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma categoria encontrada.
              </p>
            ) : (
              visibleCategories.map((category) => {
                const totalCards = cards.filter(
                  (card) => card.categoryId === category.id
                ).length

                const isActive = category.id === selectedCategory?.id

                return (
                  <div
                    key={category.id}
                    onClick={() => selectCategory(category.id)}
                    className="flex w-full cursor-pointer items-start justify-between rounded-xl border p-3 text-left transition-all hover:border-muted-foreground/30"
                    style={{
                      borderColor: isActive ? category.color : undefined,
                      background: isActive
                        ? `${category.color}12`
                        : "transparent",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                        style={{ background: `${category.color}20` }}
                      >
                        {category.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {category.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {category.description || "Sem descrição"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {totalCards} cartas
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(event) => {
                        event.stopPropagation()
                        onDeleteCategory(category.id)
                      }}
                      className="rounded-md p-1 text-muted-foreground transition-colors hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </Card>

        <Card className="space-y-4 xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Cartas da categoria ativa
              </h3>
              <p className="text-xs text-muted-foreground">
                Cadastro manual e importação em lote.
              </p>
            </div>
            {selectedCategory && (
              <Badge variant="pink">
                {selectedCategory.icon} {selectedCategory.name}
              </Badge>
            )}
          </div>

          {!selectedCategory ? (
            <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              Crie ou selecione uma categoria para começar.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    Pergunta
                  </label>
                  <textarea
                    value={cardForm.question}
                    onChange={(e) =>
                      setCardForm((current) => ({
                        ...current,
                        question: e.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full rounded-xl border border-border bg-muted px-3 py-2 text-sm outline-none"
                    placeholder="Pergunta do flashcard"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    Resposta
                  </label>
                  <textarea
                    value={cardForm.answer}
                    onChange={(e) =>
                      setCardForm((current) => ({
                        ...current,
                        answer: e.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full rounded-xl border border-border bg-muted px-3 py-2 text-sm outline-none"
                    placeholder="Resposta do flashcard"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-2 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
                      Tags
                    </label>
                    <input
                      value={cardForm.tags}
                      onChange={(e) =>
                        setCardForm((current) => ({
                          ...current,
                          tags: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none"
                      placeholder="separadas por vírgula"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
                      Dificuldade
                    </label>
                    <select
                      value={cardForm.difficulty}
                      onChange={(e) =>
                        setCardForm((current) => ({
                          ...current,
                          difficulty: e.target.value as
                            "easy" | "normal" | "hard",
                        }))
                      }
                      className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none"
                    >
                      <option value="easy">easy</option>
                      <option value="normal">normal</option>
                      <option value="hard">hard</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={onCreateCard}
                  className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: C.pink }}
                >
                  Criar carta manual
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">
                    Cartas cadastradas
                  </h4>
                  <Badge>{selectedCards.length}</Badge>
                </div>

                <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
                  {selectedCards.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                      Nenhuma carta ainda. Crie manualmente ou importe por JSON.
                    </div>
                  ) : (
                    selectedCards.map((card, index) => (
                      <div
                        key={card.id}
                        className="rounded-xl border border-border bg-card p-4"
                      >
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                            Carta {index + 1}
                          </p>
                          <Badge
                            variant={
                              card.difficulty === "hard"
                                ? "danger"
                                : card.difficulty === "easy"
                                  ? "success"
                                  : "warning"
                            }
                          >
                            {card.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {card.question}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {card.answer}
                        </p>
                        {card.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {card.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-muted px-2 py-1 text-[11px] text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Modelo para IA
              </h3>
              <p className="text-xs text-muted-foreground">
                Esse é o formato esperado para imports automáticos.
              </p>
            </div>
          </div>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-border bg-muted p-4 text-xs text-muted-foreground">
            {JSON.stringify(CARD_IMPORT_TEMPLATE, null, 2)}
          </pre>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-foreground">Fluxo ativo</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Categorias</span>
              <span className="font-medium text-foreground">
                {categories.length}
              </span>
            </div>
            <ProgressBar value={categories.length ? 100 : 0} color={C.pink} />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Cartas</span>
              <span className="font-medium text-foreground">
                {cards.length}
              </span>
            </div>
            <ProgressBar value={cards.length ? 100 : 0} color={C.mauve} />
          </div>
        </Card>
      </div>
    </div>
  )
}

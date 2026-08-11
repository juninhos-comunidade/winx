import { useState } from "react"
import { Edit2, EyeOff, Filter, Plus, Search, Trash2, X, Eye } from "lucide-react"

import { Badge, Card, ProgressBar } from "@/components/app-primitives"
import { C, stacks } from "@/lib/mock-data"

export function StacksPage() {
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({
    question: "",
    answer: "",
    stack: "Anatomia",
    difficulty: "Normal",
    tags: "",
  })
  const [previewMd, setPreviewMd] = useState(false)

  const filtered = stacks.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-48 flex-1 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
          <Search size={14} className="shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar stacks..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X size={12} className="text-muted-foreground" />
            </button>
          )}
        </div>
        <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <Filter size={14} /> Filtrar
        </button>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: C.pink }}
        >
          <Plus size={14} /> Novo flashcard
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((stack) => (
          <Card
            key={stack.id}
            className="group cursor-pointer transition-all hover:border-muted-foreground/20"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
                  style={{ background: `${stack.color}18` }}
                >
                  {stack.icon}
                </div>
                <div>
                  <h3
                    className="text-sm font-semibold text-foreground"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    {stack.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {stack.cards} cards
                  </p>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <Edit2 size={13} />
                </button>
                <button className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-red-400">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progresso</span>
                <span className="font-medium text-foreground">
                  {stack.progress}%
                </span>
              </div>
              <ProgressBar value={stack.progress} color={stack.color} />
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    stack.accuracy >= 85
                      ? "success"
                      : stack.accuracy >= 70
                        ? "warning"
                        : "danger"
                  }
                >
                  {stack.accuracy}% acerto
                </Badge>
                <button
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-90"
                  style={{ background: `${stack.color}20`, color: stack.color }}
                >
                  Revisar
                </button>
              </div>
            </div>
          </Card>
        ))}

        <div className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-6 transition-colors hover:border-muted-foreground/30">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-dashed border-border transition-colors group-hover:border-muted-foreground/40">
            <Plus size={18} className="text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Novo stack
          </p>
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card">
            <div
              className="flex items-center justify-between border-b p-5"
              style={{ borderColor: C.border }}
            >
              <h2
                className="font-semibold text-foreground"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                Novo flashcard
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4 p-5">
              <div>
                <label className="mb-2 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  Pergunta
                </label>
                <textarea
                  value={form.question}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, question: e.target.value }))
                  }
                  rows={3}
                  placeholder="Digite a pergunta..."
                  className="w-full resize-none rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-colors outline-none focus:border-primary/40"
                />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    Resposta
                  </label>
                  <button
                    onClick={() => setPreviewMd(!previewMd)}
                    className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {previewMd ? <EyeOff size={12} /> : <Eye size={12} />}
                    {previewMd ? "Editor" : "Preview"}
                  </button>
                </div>
                <textarea
                  value={form.answer}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, answer: e.target.value }))
                  }
                  rows={4}
                  placeholder="Suporta **markdown**..."
                  className="w-full resize-none rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-colors outline-none focus:border-primary/40"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    Stack
                  </label>
                  <select
                    value={form.stack}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, stack: e.target.value }))
                    }
                    className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none"
                  >
                    {stacks.map((s) => (
                      <option key={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    Dificuldade
                  </label>
                  <select
                    value={form.difficulty}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, difficulty: e.target.value }))
                    }
                    className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none"
                  >
                    {["Fácil", "Normal", "Difícil"].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  Tags
                </label>
                <input
                  value={form.tags}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tags: e.target.value }))
                  }
                  placeholder="ex: coração, sistema, urgente"
                  className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-colors outline-none focus:border-primary/40"
                />
              </div>
            </div>
            <div className="flex gap-3 p-5 pt-0">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Cancelar
              </button>
              <button
                className="flex-1 rounded-lg py-2.5 text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ background: C.pink }}
              >
                Criar flashcard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


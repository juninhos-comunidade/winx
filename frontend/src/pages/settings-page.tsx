import { useState } from "react"
import { Eye, EyeOff, Key, Lock, Plus, RotateCcw } from "lucide-react"

import { Avatar, Card, Toggle } from "@/components/app-primitives"
import { C, mockUser } from "@/lib/mock-data"

export function SettingsPage() {
  const [tab, setTab] = useState("perfil")
  const [notifToggles, setNotifToggles] = useState({
    daily: true,
    streak: true,
    ranking: false,
    email: true,
  })
  const [dailyGoal, setDailyGoal] = useState(30)
  const [showPass, setShowPass] = useState(false)
  const tabs = ["perfil", "metas", "notificações", "segurança", "api"]

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex flex-wrap gap-1 rounded-xl bg-muted p-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-all"
            style={{
              background: tab === t ? C.pink : "transparent",
              color: tab === t ? "white" : "#6b6378",
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "perfil" && (
        <Card className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar initials={mockUser.initials} size="lg" />
              <button
                className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border border-border"
                style={{ background: C.surface }}
              >
                <Plus size={10} style={{ color: C.pink }} />
              </button>
            </div>
            <div>
              <p
                className="font-semibold text-foreground"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {mockUser.name}
              </p>
              <p className="text-xs text-muted-foreground">ana.clara@med.br</p>
              <button
                className="mt-1 text-xs transition-colors"
                style={{ color: C.pink }}
              >
                Alterar foto
              </button>
            </div>
          </div>
          {[
            { label: "Nome completo", value: mockUser.name },
            { label: "E-mail", value: "ana.clara@med.br" },
            { label: "Instituição", value: "UNICAMP — Medicina" },
            { label: "Período", value: "4º semestre" },
          ].map((f) => (
            <div key={f.label}>
              <label className="mb-1.5 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
                {f.label}
              </label>
              <input
                defaultValue={f.value}
                className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-foreground transition-colors outline-none focus:border-primary/40"
              />
            </div>
          ))}
          <button
            className="w-full rounded-lg py-2.5 text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: C.pink }}
          >
            Salvar alterações
          </button>
        </Card>
      )}

      {tab === "metas" && (
        <Card className="space-y-6">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Meta diária de cards
              </label>
              <span
                className="text-lg font-bold"
                style={{ color: C.pink, fontFamily: "Roboto, sans-serif" }}
              >
                {dailyGoal}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={200}
              step={5}
              value={dailyGoal}
              onChange={(e) => setDailyGoal(+e.target.value)}
              className="w-full"
              style={{ accentColor: C.pink }}
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>10</span>
              <span>200</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[20, 50, 100].map((n) => (
              <button
                key={n}
                onClick={() => setDailyGoal(n)}
                className="rounded-lg border py-2 text-sm font-medium transition-all"
                style={{
                  borderColor: dailyGoal === n ? C.pink : C.border,
                  color: dailyGoal === n ? C.pink : "#6b6378",
                  background: dailyGoal === n ? `${C.pink}10` : "transparent",
                }}
              >
                {n} cards/dia
              </button>
            ))}
          </div>
          <div
            className="flex items-center justify-between border-t py-3"
            style={{ borderColor: C.border }}
          >
            <div>
              <p className="text-sm font-medium text-foreground">
                Lembrete diário
              </p>
              <p className="text-xs text-muted-foreground">
                Notificar às 19:00
              </p>
            </div>
            <Toggle checked={true} onChange={() => {}} />
          </div>
        </Card>
      )}

      {tab === "notificações" && (
        <Card className="space-y-1">
          {(
            [
              {
                key: "daily",
                label: "Lembrete diário",
                desc: "Aviso para não perder o streak",
              },
              {
                key: "streak",
                label: "Alerta de streak",
                desc: "Quando estiver prestes a perder",
              },
              {
                key: "ranking",
                label: "Mudanças no ranking",
                desc: "Quando subir ou descer de posição",
              },
              {
                key: "email",
                label: "Resumo semanal",
                desc: "Relatório por e-mail toda segunda",
              },
            ] as const
          ).map(({ key, label, desc }) => (
            <div
              key={key}
              className="flex items-center justify-between border-b py-3 last:border-0"
              style={{ borderColor: C.border }}
            >
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Toggle
                checked={notifToggles[key]}
                onChange={(v) => setNotifToggles((t) => ({ ...t, [key]: v }))}
              />
            </div>
          ))}
        </Card>
      )}

      {tab === "segurança" && (
        <Card className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Senha atual
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 pr-10 text-sm text-foreground transition-colors outline-none"
              />
              <button
                onClick={() => setShowPass(!showPass)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Nova senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-foreground transition-colors outline-none"
            />
          </div>
          <div
            className="flex items-center justify-between border-t py-3"
            style={{ borderColor: C.border }}
          >
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Lock size={14} /> Autenticação 2FA
              </p>
              <p className="text-xs text-muted-foreground">
                Camada extra de segurança
              </p>
            </div>
            <Toggle checked={false} onChange={() => {}} />
          </div>
          <button
            className="w-full rounded-lg py-2.5 text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: C.pink }}
          >
            Atualizar senha
          </button>
        </Card>
      )}

      {tab === "api" && (
        <Card className="space-y-5">
          <div
            className="flex items-center gap-3 rounded-xl border p-4"
            style={{ borderColor: `${C.pink}30`, background: `${C.pink}08` }}
          >
            <Key size={16} style={{ color: C.pink }} />
            <div>
              <p className="text-sm font-medium text-foreground">
                Chave de API
              </p>
              <p className="text-xs text-muted-foreground">
                Integre com apps externos
              </p>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Sua API Key
            </label>
            <div className="flex gap-2">
              <input
                defaultValue="mnm_sk_•••••••••••••••••••••••••••••••• "
                readOnly
                className="flex-1 rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-muted-foreground outline-none"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              />
              <button className="rounded-lg border border-border px-3 py-2.5 text-muted-foreground transition-colors hover:text-foreground">
                <Eye size={14} />
              </button>
            </div>
          </div>
          <button className="flex items-center gap-2 text-sm text-destructive transition-opacity hover:opacity-80">
            <RotateCcw size={13} /> Regenerar chave
          </button>
        </Card>
      )}
    </div>
  )
}

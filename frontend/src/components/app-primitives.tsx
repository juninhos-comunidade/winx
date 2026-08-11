import type { ElementType, ReactNode } from "react"
import { Clock } from "lucide-react"
import { C } from "@/lib/mock-data"

export function Card({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-xl border border-border bg-card p-5 ${className}`}>
      {children}
    </div>
  )
}

export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = C.pink,
}: {
  icon: ElementType
  label: string
  value: string | number
  sub: string
  color?: string
}) {
  return (
    <Card className="flex items-start gap-4">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{ background: `${color}1a` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          {label}
        </p>
        <p
          className="mt-0.5 text-2xl font-bold text-foreground"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {value}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
      </div>
    </Card>
  )
}

export function ProgressBar({
  value,
  color = C.pink,
}: {
  value: number
  color?: string
}) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  )
}

export function Badge({
  children,
  variant = "default",
}: {
  children: ReactNode
  variant?: "default" | "success" | "warning" | "danger" | "pink"
}) {
  const styles: Record<string, string> = {
    default: "bg-muted text-muted-foreground",
    success: "bg-green-400/10 text-green-400",
    warning: "bg-yellow-400/10 text-yellow-400",
    danger: "bg-red-400/10 text-red-400",
    pink: "text-white",
  }
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${styles[variant]}`}
      style={
        variant === "pink"
          ? { background: `${C.pink}22`, color: C.pinkLight }
          : undefined
      }
    >
      {children}
    </span>
  )
}

export function Avatar({
  initials,
  size = "sm",
  color = C.pink,
}: {
  initials: string
  size?: "sm" | "md" | "lg"
  color?: string
}) {
  const s =
    size === "sm"
      ? "w-8 h-8 text-xs"
      : size === "md"
        ? "w-10 h-10 text-sm"
        : "w-14 h-14 text-lg"
  return (
    <div
      className={`${s} flex shrink-0 items-center justify-center rounded-full font-bold`}
      style={{ background: `${color}33`, color }}
    >
      {initials}
    </div>
  )
}

export function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
      style={{ background: checked ? C.pink : "rgba(255,255,255,0.1)" }}
    >
      <span
        className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  )
}

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs"
      style={{ background: "#1a1728", borderColor: C.border }}
    >
      <p className="mb-1 text-muted-foreground">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || C.pink }}>
          <span className="font-bold">{p.value}</span>
          {p.dataKey === "acc" ? "%" : ""}
        </p>
      ))}
    </div>
  )
}

export function formatTimer(seconds: number) {
  return (
    <div
      className="flex items-center gap-1.5 text-xs text-muted-foreground"
      style={{ fontFamily: "JetBrains Mono, monospace" }}
    >
      <Clock size={12} />
      {seconds}s
    </div>
  )
}


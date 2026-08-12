import { BookOpen, Clock, Flame, Target, Trophy } from "lucide-react"

export const C = {
  pink: "#db62a1",
  pinkLight: "#f07bc0",
  mauve: "#9c8ea8",
  lavender: "#7c6fa8",
  success: "#4ade80",
  warning: "#facc15",
  danger: "#f87171",
  surface: "#1a1728",
  border: "rgba(255,255,255,0.07)",
}

export const dashboardStats = [
  {
    icon: BookOpen,
    label: "Categorias",
    value: 0,
    sub: "Crie sua primeira categoria",
    color: C.pink,
  },
  {
    icon: Target,
    label: "Cartas",
    value: 0,
    sub: "Manuais ou importadas por JSON",
    color: C.mauve,
  },
  {
    icon: Flame,
    label: "Sessão atual",
    value: "0",
    sub: "Pronto para revisar",
    color: "#f97316",
  },
  {
    icon: Trophy,
    label: "Módulo core",
    value: "100%",
    sub: "Sem dependência de mock",
    color: C.warning,
  },
  {
    icon: Clock,
    label: "Fluxo",
    value: "Zustand",
    sub: "Categorias, cartas e revisão",
    color: C.lavender,
  },
]

export function formatDate() {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date())
}

export function heatColor(val: number) {
  if (val === 0) return "rgba(255,255,255,0.05)"
  if (val === 1) return "rgba(219,98,161,0.25)"
  if (val === 2) return "rgba(219,98,161,0.45)"
  if (val === 3) return "rgba(219,98,161,0.65)"
  return "rgba(219,98,161,0.9)"
}

export const heatmapData = Array.from({ length: 52 }, () =>
  Array.from({ length: 7 }, () => 0)
)

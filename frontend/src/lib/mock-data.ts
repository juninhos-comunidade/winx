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

export const mockUser = {
  name: "Ana Clara",
  initials: "AC",
  streak: 23,
  rank: 7,
  plan: "Pro",
}

export const lineData = [
  { day: "Seg", acc: 72 },
  { day: "Ter", acc: 68 },
  { day: "Qua", acc: 81 },
  { day: "Qui", acc: 75 },
  { day: "Sex", acc: 88 },
  { day: "Sáb", acc: 84 },
  { day: "Dom", acc: 91 },
]

export const barData = [
  { stack: "Anatomia", reviews: 142 },
  { stack: "Fisiologia", reviews: 98 },
  { stack: "Bioquímica", reviews: 76 },
  { stack: "Farmácia", reviews: 54 },
  { stack: "Histologia", reviews: 38 },
  { stack: "Patologia", reviews: 29 },
]

export const donutData = [
  { name: "Fácil", value: 38, color: C.success },
  { name: "Normal", value: 41, color: C.mauve },
  { name: "Difícil", value: 14, color: C.warning },
  { name: "Errado", value: 7, color: C.danger },
]

export const recentSessions = [
  {
    id: 1,
    date: "14/07/2026",
    stack: "Anatomia",
    cards: 40,
    accuracy: 92,
    time: "18min",
    points: 320,
  },
  {
    id: 2,
    date: "14/07/2026",
    stack: "Fisiologia",
    cards: 25,
    accuracy: 76,
    time: "12min",
    points: 190,
  },
  {
    id: 3,
    date: "13/07/2026",
    stack: "Bioquímica",
    cards: 30,
    accuracy: 83,
    time: "15min",
    points: 249,
  },
  {
    id: 4,
    date: "13/07/2026",
    stack: "Farmácia",
    cards: 20,
    accuracy: 65,
    time: "11min",
    points: 130,
  },
  {
    id: 5,
    date: "12/07/2026",
    stack: "Histologia",
    cards: 35,
    accuracy: 88,
    time: "16min",
    points: 308,
  },
  {
    id: 6,
    date: "12/07/2026",
    stack: "Anatomia",
    cards: 45,
    accuracy: 94,
    time: "20min",
    points: 423,
  },
]

export const achievements = [
  {
    id: 1,
    icon: "🔥",
    name: "Em Chamas",
    desc: "7 dias seguidos",
    unlocked: true,
    progress: 100,
  },
  {
    id: 2,
    icon: "⚡",
    name: "Relâmpago",
    desc: "100 cards em 1 dia",
    unlocked: true,
    progress: 100,
  },
  {
    id: 3,
    icon: "🎯",
    name: "Sniper",
    desc: "10 sessões com 95%+",
    unlocked: true,
    progress: 100,
  },
  {
    id: 4,
    icon: "💎",
    name: "Diamante",
    desc: "30 dias seguidos",
    unlocked: false,
    progress: 77,
  },
  {
    id: 5,
    icon: "🚀",
    name: "Decolagem",
    desc: "Top 5 no ranking",
    unlocked: false,
    progress: 40,
  },
  {
    id: 6,
    icon: "📚",
    name: "Devorador",
    desc: "1000 cards revisados",
    unlocked: true,
    progress: 100,
  },
  {
    id: 7,
    icon: "🌙",
    name: "Coruja",
    desc: "Revisar após meia-noite",
    unlocked: true,
    progress: 100,
  },
  {
    id: 8,
    icon: "🏆",
    name: "Campeão",
    desc: "1º lugar por 1 semana",
    unlocked: false,
    progress: 0,
  },
  {
    id: 9,
    icon: "🧠",
    name: "Gênio",
    desc: "100 dias seguidos",
    unlocked: false,
    progress: 23,
  },
  {
    id: 10,
    icon: "✨",
    name: "Perfeição",
    desc: "5 sessões 100% precisão",
    unlocked: false,
    progress: 60,
  },
  {
    id: 11,
    icon: "🌱",
    name: "Iniciante",
    desc: "Primeira revisão",
    unlocked: true,
    progress: 100,
  },
  {
    id: 12,
    icon: "🎲",
    name: "Curioso",
    desc: "Revisar 5 stacks diferentes",
    unlocked: true,
    progress: 100,
  },
]

export function generateHeatmap() {
  const weeks: number[][] = []
  for (let w = 0; w < 52; w++) {
    const days: number[] = []
    for (let d = 0; d < 7; d++) {
      const weeksAgo = 51 - w
      const daysAgo = weeksAgo * 7 + (6 - d)
      const isRecent = daysAgo < 23
      const val = isRecent
        ? Math.floor(Math.random() * 5)
        : Math.random() > 0.6
          ? Math.floor(Math.random() * 4)
          : 0
      days.push(val)
    }
    weeks.push(days)
  }
  return weeks
}

export const heatmapData = generateHeatmap()

export function heatColor(val: number) {
  if (val === 0) return "rgba(255,255,255,0.05)"
  if (val === 1) return "rgba(219,98,161,0.25)"
  if (val === 2) return "rgba(219,98,161,0.45)"
  if (val === 3) return "rgba(219,98,161,0.65)"
  return "rgba(219,98,161,0.9)"
}

export const dashboardStats = [
  {
    icon: BookOpen,
    label: "Revisados hoje",
    value: 47,
    sub: "+12 vs ontem",
    color: C.pink,
  },
  {
    icon: Target,
    label: "Taxa de acerto",
    value: "84%",
    sub: "↑ 3% esta semana",
    color: C.mauve,
  },
  {
    icon: Flame,
    label: "Streak atual",
    value: `${mockUser.streak}d`,
    sub: "Recorde: 31 dias",
    color: "#f97316",
  },
  {
    icon: Trophy,
    label: "Ranking",
    value: `#${mockUser.rank}`,
    sub: "Top 8% global",
    color: C.warning,
  },
  {
    icon: Clock,
    label: "Tempo médio",
    value: "12s",
    sub: "por flashcard",
    color: C.lavender,
  },
]

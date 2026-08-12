import { Layers, Play } from "lucide-react"

export const navItems = [
  { id: "stacks", label: "Categorias", icon: Layers, path: "/stacks" },
  { id: "review", label: "Revisar", icon: Play, path: "/review" },
]

export const customPageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/stacks": "Categorias",
  "/review": "Revisão",
  "/ranking": "Ranking",
  "/history": "Histórico",
  "/achievements": "Conquistas",
  "/settings": "Configurações",
}

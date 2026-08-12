import { Flame, RotateCcw } from "lucide-react"

import { Badge, Card } from "@/components/app-primitives"
import { C } from "@/lib/theme"

export function RankingPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="space-y-3">
        <Badge variant="pink">Segundo plano</Badge>
        <h2 className="text-xl font-bold text-foreground">Ranking</h2>
        <p className="text-sm text-muted-foreground">
          Esta área ficou propositalmente leve para não competir com o core do
          sistema.
        </p>
      </Card>

      <Card className="space-y-3">
        <p className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Flame size={14} style={{ color: C.pink }} />O ranking pode ser ligado
          ao back depois.
        </p>
        <p className="text-sm text-muted-foreground">
          A estrutura principal agora está em categorias, cartas e revisão.
        </p>
      </Card>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <RotateCcw size={12} />
        Sem dados mockados neste módulo
      </div>
    </div>
  )
}

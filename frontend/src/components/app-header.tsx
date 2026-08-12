import { useMemo } from "react"
import { AlignLeft, Maximize2 } from "lucide-react"

import { formatDate } from "@/lib/theme"
import { customPageTitles } from "@/lib/navigation"

type AppHeaderProps = {
  onToggleSidebar: () => void
  pathname: string
}

export default function AppHeader({
  onToggleSidebar,
  pathname,
}: AppHeaderProps) {
  // const [notifs, setNotifs] = useState(3)
  const title = useMemo(
    () => customPageTitles[pathname] ?? "FlashRank",
    [pathname]
  )

  return (
    <header
      className="flex h-16 shrink-0 items-center gap-4 border-b px-6"
      style={{
        borderColor: "var(--sidebar-border)",
        background: "var(--sidebar)",
      }}
    >
      <button
        onClick={onToggleSidebar}
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        <AlignLeft size={18} />
      </button>

      <div className="min-w-0 flex-1">
        {pathname === "/" ? (
          <div>
            <p className="mb-0.5 text-xs leading-none text-muted-foreground capitalize">
              {formatDate()}
            </p>
            <h1
              className="text-sm leading-none font-semibold text-foreground"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              Fluxo principal: categorias, cartas e revisão
            </h1>
          </div>
        ) : (
          <h1
            className="text-sm font-semibold text-foreground"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            {title}
          </h1>
        )}
      </div>

      {/* <button
        className="relative text-muted-foreground transition-colors hover:text-foreground"
        onClick={() => setNotifs(0)}
      >
        <Bell size={18} />
        {notifs > 0 && (
          <span
            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full font-bold text-white"
            style={{ background: C.pink, fontSize: 9 }}
          >
            {notifs}
          </span>
        )}
      </button> */}

      <button className="text-muted-foreground transition-colors hover:text-foreground">
        <Maximize2 size={16} />
      </button>
    </header>
  )
}

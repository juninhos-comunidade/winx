import { Flame,LogOut } from "lucide-react"
import { Link, NavLink } from "react-router"

import logo from "/favicon.ico"
import { Avatar } from "@/components/app-primitives"
import { navItems } from "@/lib/navigation"
import { C } from "@/lib/theme"

import packageJson from "../../package.json"

type AppSidebarProps = {
  open: boolean
}

export function AppSidebar({ open }: AppSidebarProps) {
  return (
    <aside
      className="flex shrink-0 flex-col border-r transition-all duration-300"
      style={{
        width: open ? 240 : 72,
        background: "var(--sidebar)",
        borderColor: "var(--sidebar-border)",
      }}
    >
      <div
        className="flex h-16 shrink-0 items-center justify-center gap-3 border-b"
        style={{ borderColor: "var(--sidebar-border)" }}
      >
        <Link to="/" className="flex shrink-0 items-center justify-center">
          <img src={logo} alt="FlashRank Logo" className="h-7 w-7" />
        </Link>
        {open && (
          <div className="min-w-0">
            <p
              className="text-2xl font-bold tracking-wide text-foreground"
              style={{ fontFamily: "Antonio, sans-serif" }}
            >
              FLASHRANK
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-0.5 px-2">
          {navItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              title={!open ? label : undefined}
              className={({ isActive }) =>
                [
                  "relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                  isActive
                    ? "bg-white/5 text-white"
                    : "text-[rgba(237,233,244,0.55)] hover:bg-white/5 hover:text-white",
                ].join(" ")
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background: `${C.pink}18`,
                      color: C.pink,
                    }
                  : undefined
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-r-full"
                      style={{ background: C.pink }}
                    />
                  )}
                  <Icon size={18} className="shrink-0" />
                  {open && <span className="truncate">{label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <div
        className="shrink-0 space-y-2 border-t p-3"
        style={{ borderColor: "var(--sidebar-border)" }}
      >
        {open ? (
          <div className="flex items-center gap-3 px-1">
            <Avatar initials="U" size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">
                User
              </p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Flame size={10} style={{ color: C.pink }} />
                Conta padrão
              </p>
            </div>
            <button className="text-muted-foreground transition-colors hover:text-foreground">
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button className="flex w-full items-center justify-center py-1.5 text-muted-foreground transition-colors hover:text-foreground">
            <LogOut size={16} />
          </button>
        )}
        {open && (
          <p className="text-center text-xs text-muted-foreground opacity-40">
            v {packageJson.version}
          </p>
        )}
      </div>
    </aside>
  )
}

import { useEffect, useState } from "react"
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router"

import AppHeader from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { AchievementsPage } from "@/pages/achievements-page"
// import { DashboardPage } from "@/pages/dashboard-page"
import { HistoryPage } from "@/pages/history-page"
import { RankingPage } from "@/pages/ranking-page"
import { ReviewPage } from "@/pages/review-page"
import { SettingsPage } from "@/pages/settings-page"
import { StacksPage } from "@/pages/stacks-page"

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      .card-flip { perspective: 1200px; }
      .card-flip-inner { transition: transform 0.55s cubic-bezier(.4,0,.2,1); transform-style: preserve-3d; position: relative; width: 100%; height: 100%; }
      .card-flip-inner.flipped { transform: rotateY(180deg); }
      .card-face { backface-visibility: hidden; -webkit-backface-visibility: hidden; position: absolute; inset: 0; }
      .card-back { transform: rotateY(180deg); }
      ::-webkit-scrollbar { width: 3px; height: 3px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
      ::-webkit-scrollbar-thumb:hover { background: rgba(219,98,161,0.4); }
      select option { background: #1a1728; }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <AppSidebar open={sidebarOpen} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AppHeader
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          pathname={location.pathname}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<StacksPage />} />
          <Route path="/stacks" element={<StacksPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

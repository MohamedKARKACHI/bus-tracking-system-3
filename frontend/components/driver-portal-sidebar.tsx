"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  Gauge,
  Navigation,
  Clock,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Map,
} from "lucide-react"
import { useDriverSidebar } from "@/lib/driver-sidebar-context"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

const menuItems = [
  { href: "/driver-portal", icon: Gauge, label: "Dashboard" },
  { href: "/driver-portal/track-route", icon: Map, label: "Track Route" },
  { href: "/driver-portal/routes", icon: Navigation, label: "My Routes" },
  { href: "/driver-portal/schedule", icon: Clock, label: "Schedule" },
  { href: "/driver-portal/incidents", icon: AlertCircle, label: "Incidents" },
  { href: "/driver-portal/performance", icon: TrendingUp, label: "Performance" },
  { href: "/driver-portal/messages", icon: MessageSquare, label: "Messages" },
]

export function DriverPortalSidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen, sidebarExpanded, toggleExpanded } = useDriverSidebar()
  const router = useRouter()
  const { logout } = useAuth()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogout = () => {
    setShowLogoutDialog(true)
  }

  const confirmLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <>
      <aside
        className={cn(
          "hidden lg:block fixed inset-y-0 left-0 z-40 bg-card/95 dark:bg-card/90 backdrop-blur-xl border-r border-border/50 dark:border-border/30 transition-all duration-300 shadow-xl",
          sidebarExpanded ? "w-72" : "w-20",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-border/50 dark:border-border/30 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/5 dark:to-cyan-500/5 flex-shrink-0">
            {sidebarExpanded && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                  <Gauge className="h-4 w-4 text-white" />
                </div>
                <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Driver Portal</span>
              </div>
            )}
            <button
              onClick={() => {
                if (window.innerWidth >= 1024) {
                  toggleExpanded()
                } else {
                  setSidebarOpen(false)
                }
              }}
              className="p-2 rounded-lg hover:bg-muted/50 dark:hover:bg-muted/30 text-muted-foreground hover:text-foreground dark:hover:text-foreground transition-all hover:scale-110"
              aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 p-2 sm:p-3 space-y-1 flex flex-col justify-between overflow-hidden">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all group relative",
                      sidebarExpanded ? "justify-start" : "justify-center",
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 scale-105"
                        : "text-muted-foreground hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-cyan-500/10 dark:hover:from-blue-500/5 dark:hover:to-cyan-500/5 hover:text-foreground dark:hover:text-foreground hover:scale-102",
                    )}
                  >
                    <Icon className={cn(
                      "h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110",
                      isActive && "drop-shadow-lg"
                    )} />
                    {sidebarExpanded && <span className="text-sm">{item.label}</span>}
                    {!sidebarExpanded && isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 rounded-r-full" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-2 sm:p-3 border-t border-border/50 dark:border-border/30 space-y-1 bg-gradient-to-t from-muted/20 dark:from-muted/10 flex-shrink-0">
            <div className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-xl bg-muted/50 dark:bg-muted/30",
              sidebarExpanded ? "justify-between" : "justify-center"
            )}>
              {sidebarExpanded && <span className="text-xs font-medium text-muted-foreground dark:text-muted-foreground">Theme</span>}
              <ThemeToggle />
            </div>

            <Link
              href="/settings"
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 dark:hover:from-purple-500/5 dark:hover:to-pink-500/5 hover:text-foreground dark:hover:text-foreground transition-all hover:scale-102",
                sidebarExpanded ? "justify-start" : "justify-center"
              )}
            >
              <Settings className="h-5 w-5 flex-shrink-0" />
              {sidebarExpanded && <span className="text-sm">Settings</span>}
            </Link>
            <button
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-500 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/5 hover:text-red-600 dark:hover:text-red-300 transition-all hover:scale-102",
                sidebarExpanded ? "justify-start" : "justify-center"
              )}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {sidebarExpanded && <span className="text-sm font-medium">Log Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 dark:bg-background/90 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-red-500/10">
                <LogOut className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Confirm Logout</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to logout? You will need to sign in again to access your account.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border hover:bg-muted/50 text-foreground font-medium transition-all duration-200 hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-red-500/30"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

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
  Search,
  Command
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
          "hidden lg:block fixed inset-y-0 left-0 z-40 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 shadow-none",
          sidebarExpanded ? "w-64" : "w-[70px]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className={cn(
            "flex items-center h-16 border-b border-transparent dark:border-slate-800/50 flex-shrink-0",
            !sidebarExpanded ? "justify-center px-2" : "justify-between px-6"
          )}>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none">
                <Gauge className="h-4 w-4" />
              </div>
              {sidebarExpanded && (
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                  Driver<span className="text-indigo-600 dark:text-indigo-400">Portal</span>
                </span>
              )}
            </div>

            {/* Toggle Button in Header for expanded view */}
            {sidebarExpanded && (
              <button
                onClick={() => {
                  if (window.innerWidth >= 1024) toggleExpanded();
                  else setSidebarOpen(false);
                }}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Search Bar (Mock) - Only visible when expanded */}
          {sidebarExpanded && (
            <div className="px-4 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full h-9 pl-9 pr-8 rounded-lg bg-slate-100 dark:bg-slate-900 border-none text-sm text-slate-600 dark:text-slate-300 placeholder:text-slate-400 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center h-5 w-5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                  <Command className="h-3 w-3 text-slate-400" />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <div className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200",
                    !sidebarExpanded ? "justify-center px-2 py-3" : "px-3 py-2.5",
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200",
                  )}
                >
                  <div className="relative flex items-center justify-center">
                    <Icon className={cn(
                      "h-5 w-5 flex-shrink-0 transition-colors",
                      isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                    )} />
                    {isActive && !sidebarExpanded && (
                      <span className="absolute -right-1 top-0 h-2 w-2 rounded-full bg-indigo-500" />
                    )}
                  </div>
                  {sidebarExpanded && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {isActive && (
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-1" />
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <div className={cn("hidden lg:block mb-2", !sidebarExpanded ? "text-center" : "")}>
              <ThemeToggle />
            </div>

            <Link
              href="/settings"
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "group flex items-center gap-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white transition-all w-full",
                !sidebarExpanded ? "justify-center px-2 py-3" : "px-3 py-2.5",
              )}
            >
              <Settings className="h-5 w-5 flex-shrink-0" />
              {sidebarExpanded && <span>Settings</span>}
            </Link>

            <button
              onClick={handleLogout}
              className={cn(
                "group flex items-center gap-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-all w-full",
                !sidebarExpanded ? "justify-center px-2 py-3" : "px-3 py-2.5",
              )}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {sidebarExpanded && <span>Log Out</span>}
            </button>
          </div>

          {/* Collapsed Toggle (if collapsed) */}
          {!sidebarExpanded && (
            <div className="absolute -right-3 top-20 z-50">
              <button
                onClick={toggleExpanded}
                className="h-6 w-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm"
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          )}

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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Sign out?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Are you sure you want to sign out of your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors shadow-lg shadow-red-500/20"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

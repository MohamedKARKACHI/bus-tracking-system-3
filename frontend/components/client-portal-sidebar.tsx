"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useClientSidebar } from "@/lib/client-sidebar-context"
import {
  LayoutDashboard,
  Ticket,
  MapPin,
  History,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bus
} from "lucide-react"

export function ClientPortalSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { sidebarExpanded, setSidebarExpanded } = useClientSidebar()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const navItems = [
    { name: "Dashboard", href: "/client-portal", icon: LayoutDashboard },
    { name: "Book Ticket", href: "/client-portal/book-ticket", icon: Ticket },
    { name: "My Tickets", href: "/client-portal/my-tickets", icon: Ticket },
    { name: "Track Bus", href: "/client-portal/track-bus", icon: MapPin },
    { name: "History", href: "/client-portal/history", icon: History },
    { name: "Profile", href: "/client-portal/profile", icon: User },
    { name: "Settings", href: "/client-portal/settings", icon: Settings },
  ]

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <Link href="/client-portal" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Bus className="w-6 h-6 text-white" />
          </div>
          {sidebarExpanded && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                BusTrack
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Client Portal</p>
            </div>
          )}
        </Link>
      </div>

      {/* User Info */}
      {sidebarExpanded && user && (
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
              {user.name?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {user.name || 'User'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/client-portal" && pathname?.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${isActive
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }
                ${!sidebarExpanded && "justify-center"}
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarExpanded && (
                <span className="font-medium">{item.name}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
            text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30
            ${!sidebarExpanded && "justify-center"}
          `}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarExpanded && <span className="font-medium">Logout</span>}
        </button>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setSidebarExpanded(!sidebarExpanded)}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-lg"
      >
        {sidebarExpanded ? (
          <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
        )}
      </button>
    </div>
  )
}

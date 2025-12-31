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
  Bus,
  Search,
  Command
} from "lucide-react"
import { cn } from "@/lib/utils"

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
    <div className={cn(
      "h-full flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 relative z-30",
      sidebarExpanded ? "w-64" : "w-[70px]"
    )}>
      {/* Logo */}
      <div className={cn(
        "flex h-16 items-center border-b border-transparent dark:border-slate-800/50",
        !sidebarExpanded ? "justify-center px-2" : "px-6"
      )}>
        <Link href="/client-portal" className="flex items-center gap-3 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none transition-transform group-hover:scale-105">
            <span className="font-bold text-lg">B</span>
          </div>
          {sidebarExpanded && (
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white block leading-none">
                BusTrack
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Client</span>
            </div>
          )}
        </Link>
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

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/client-portal" && pathname?.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200",
                !sidebarExpanded ? "justify-center px-2 py-3" : "px-3 py-2.5",
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200",
              )}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors flex-shrink-0",
                    isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300",
                  )}
                />
                {isActive && !sidebarExpanded && (
                  <span className="absolute -right-1 top-0 h-2 w-2 rounded-full bg-indigo-500" />
                )}
              </div>

              {sidebarExpanded && (
                <>
                  <span className="font-medium flex-1">{item.name}</span>
                  {isActive && (
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-1" />
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
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

      {/* Toggle Button - Only visible on desktop if logic allows, usually handled by parent layout, but keeping here for consistency */}
      <button
        onClick={() => setSidebarExpanded(!sidebarExpanded)}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm z-50"
      >
        {sidebarExpanded ? (
          <ChevronLeft className="w-3 h-3" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}
      </button>
    </div>
  )
}

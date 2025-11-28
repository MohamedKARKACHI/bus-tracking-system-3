"use client"

import { useAuth } from "@/lib/auth-context"
import { useClientSidebar } from "@/lib/client-sidebar-context"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { MapPin, Ticket, LogOut, CreditCard, History, User, Settings, ChevronLeft, ChevronRight, Navigation } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function ClientPortalSidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { sidebarExpanded, toggleExpanded } = useClientSidebar()

  const navItems = [
    { href: "/client-portal", icon: MapPin, label: "Dashboard" },
    { href: "/client-portal/track-bus", icon: Navigation, label: "Track Bus" },
    { href: "/client-portal/book-ticket", icon: Ticket, label: "Book Ticket" },
    { href: "/client-portal/my-tickets", icon: CreditCard, label: "My Tickets" },
    { href: "/client-portal/history", icon: History, label: "Trip History" },
    { href: "/client-portal/profile", icon: User, label: "Profile" },
    { href: "/client-portal/settings", icon: Settings, label: "Settings" },
  ]

  if (!user) return null

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className={`flex items-center gap-3 ${!sidebarExpanded ? "mx-auto" : ""}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          {sidebarExpanded && (
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
              BusTrack
            </span>
          )}
        </Link>
        {sidebarExpanded && (
          <button
            onClick={toggleExpanded}
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {!sidebarExpanded && (
        <button
          onClick={toggleExpanded}
          className="mb-6 p-2 rounded-lg hover:bg-muted/50 transition-colors mx-auto"
          title="Expand sidebar"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      )}

      <div
        className={`mb-8 ${sidebarExpanded ? "p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-border" : "flex justify-center"}`}
      >
        {sidebarExpanded ? (
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500/20"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{user.name}</p>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        ) : (
          <img
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-cyan-500/20"
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center ${sidebarExpanded ? "gap-3 px-4" : "justify-center px-3"} py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
              title={!sidebarExpanded ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarExpanded && <span className="font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="space-y-2 pt-4 border-t border-border">
        <div className={`flex items-center ${sidebarExpanded ? "gap-3 px-4 justify-between" : "justify-center"} py-3`}>
          {sidebarExpanded && <span className="text-sm font-medium text-muted-foreground">Theme</span>}
          <ThemeToggle />
        </div>

        <button
          onClick={() => {
            logout()
            router.push("/")
          }}
          className={`flex items-center ${sidebarExpanded ? "gap-3 px-4" : "justify-center px-3"} py-3 rounded-xl hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-colors w-full`}
          title={!sidebarExpanded ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarExpanded && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  )
}

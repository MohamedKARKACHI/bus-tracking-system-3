"use client"

import { useAuth } from "@/lib/auth-context"
import { useClientSidebar } from "@/lib/client-sidebar-context"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { MapPin, Ticket, LogOut, CreditCard, History, User, Settings, ChevronLeft, ChevronRight, Navigation } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

export function ClientPortalSidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { sidebarExpanded, toggleExpanded } = useClientSidebar()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    setShowLogoutDialog(true)
  }

  const confirmLogout = () => {
    logout()
    router.push("/login")
  }

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
    <>
      <div className="flex flex-col h-full p-6 relative overflow-hidden">
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10 opacity-50" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className={`group flex items-center gap-3 ${!sidebarExpanded ? "mx-auto" : ""}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
              </div>
              {sidebarExpanded && (
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-in slide-in-from-left duration-300">
                  BusTrack
                </span>
              )}
            </Link>
            {sidebarExpanded && (
              <button
                onClick={toggleExpanded}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-110"
                title="Collapse sidebar"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            )}
          </div>

          {!sidebarExpanded && (
            <button
              onClick={toggleExpanded}
              className="mb-6 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-110 mx-auto"
              title="Expand sidebar"
            >
              <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          )}

          {/* User Profile */}
          <div
            className={`group mb-8 relative ${sidebarExpanded ? "p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-lg hover:shadow-xl transition-all duration-300" : "flex justify-center"}`}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
            {sidebarExpanded ? (
              <div className="relative flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-sm opacity-50" />
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    className="relative w-12 h-12 rounded-full object-cover border-2 border-blue-500/30 shadow-md"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-sm opacity-50" />
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="relative w-10 h-10 rounded-full object-cover border-2 border-blue-500/30 shadow-md"
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-lg" />
              </div>
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
                  className={`group relative flex items-center ${sidebarExpanded ? "gap-3 px-4" : "justify-center px-3"} py-3 rounded-xl transition-all duration-300 overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:scale-105"
                  }`}
                  title={!sidebarExpanded ? item.label : undefined}
                >
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                  <Icon className={`relative w-5 h-5 flex-shrink-0 transition-transform duration-300 ${!isActive && "group-hover:scale-110"}`} />
                  {sidebarExpanded && <span className="relative font-medium">{item.label}</span>}
                  {isActive && (
                    <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full shadow-lg" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer Actions */}
          <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className={`group flex items-center ${sidebarExpanded ? "gap-3 px-4 justify-between" : "justify-center"} py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105`}>
              {sidebarExpanded && <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme</span>}
              <ThemeToggle />
            </div>

            <button
              onClick={handleLogout}
              className={`group relative flex items-center ${sidebarExpanded ? "gap-3 px-4" : "justify-center px-3"} py-3 rounded-xl transition-all duration-300 w-full overflow-hidden hover:scale-105`}
              title={!sidebarExpanded ? "Logout" : undefined}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
              <LogOut className="relative w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform duration-300" />
              {sidebarExpanded && <span className="relative font-medium text-red-600 dark:text-red-400">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog - Rendered as Portal */}
      {mounted && showLogoutDialog && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-in zoom-in-95 duration-300">
            {/* Glowing gradient border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 rounded-2xl blur opacity-30" />
            
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-pink-600 rounded-full blur-md opacity-50" />
                  <div className="relative p-3 rounded-full bg-gradient-to-br from-red-500 to-pink-600 shadow-lg">
                    <LogOut className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 dark:from-red-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Confirm Logout
                </h3>
              </div>
              
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Are you sure you want to logout? You will need to sign in again to access your account.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutDialog(false)}
                  className="relative flex-1 px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-500/0 via-slate-500/5 to-slate-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative">Cancel</span>
                </button>
                <button
                  onClick={confirmLogout}
                  className="relative flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl shadow-red-500/50 overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

"use client"

import type React from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useBusData } from "@/lib/bus-data-context"
import { Calendar as CalendarIcon, MapPin, Loader2 } from "lucide-react"
import { format } from "date-fns"
import axios from "axios"

import { useState } from "react"
import {
  Bus,
  LayoutDashboard,
  Map,
  Users,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  PieChart,
  CreditCard,
  Video,
  ChevronLeft,
  ChevronRight,
  User,
  Shield,
  ScanLine,
  Search,
  Command
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CustomDropdown, DropdownItem, DropdownDivider } from "@/components/ui/custom-dropdown"
import { ThemeToggle } from "@/components/theme-toggle"
import { AdminMobileNav } from "@/components/admin-mobile-nav"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Live Tracking", href: "/tracking", icon: Map },
  { name: "Fleet Management", href: "/fleet", icon: Bus },
  { name: "ANPR Cameras", href: "/cameras", icon: Video },
  { name: "Drivers & Users", href: "/drivers", icon: Users },
  { name: "ID Cards", href: "/id-cards", icon: Shield },
  { name: "Analytics", href: "/analytics", icon: PieChart },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Check-in/Out", href: "/checkin-checkout", icon: ScanLine },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = useAuth()
  const { globalSearchQuery, setGlobalSearchQuery, setSearchDate, searchDate, triggerRouteCalculation } = useBusData()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleSearch = async (query: string) => {
    setGlobalSearchQuery(query)
    if (query.length > 2) {
      setIsSearching(true)
      try {
        // Simulate Elasticsearch with Nominatim + Local Data
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5&countrycodes=ma`)
        setSearchResults(response.data)
        setShowResults(true)
      } catch (e) {
        console.error("Search failed", e)
      } finally {
        setIsSearching(false)
      }
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }

  const handleSelectResult = (result: any) => {
    triggerRouteCalculation(result) // Use context to trigger map
    setShowResults(false)
    router.push('/tracking') // Ensure we are on the tracking page
  }

  const handleLogout = () => {
    setShowLogoutDialog(true)
  }

  const confirmLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
      {/* Sidebar - Desktop Only */}
      <div
        className={cn(
          "hidden lg:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-300 ease-in-out z-30",
          sidebarCollapsed ? "w-[70px]" : "w-64",
        )}
      >
        {/* Logo Section */}
        <div className={cn(
          "flex h-16 items-center border-b border-transparent dark:border-slate-800/50",
          sidebarCollapsed ? "justify-center px-2" : "px-6"
        )}>
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none transition-transform group-hover:scale-105">
              <span className="font-bold text-lg">B</span>
            </div>
            {!sidebarCollapsed && (
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                BusTrack
              </span>
            )}
          </Link>
        </div>


        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-2 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                title={sidebarCollapsed ? item.name : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200",
                  sidebarCollapsed ? "justify-center px-2 py-3" : "px-3 py-2.5",
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200",
                )}
              >
                <div className="relative flex items-center justify-center">
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-colors flex-shrink-0",
                      isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300",
                    )}
                  />
                  {isActive && sidebarCollapsed && (
                    <span className="absolute -right-1 top-0 h-2 w-2 rounded-full bg-indigo-500" />
                  )}
                </div>
                {!sidebarCollapsed && (
                  <>
                    <span className="truncate flex-1">{item.name}</span>
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
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
          <div className={cn("hidden lg:block mb-2", sidebarCollapsed ? "text-center" : "")}>
            <ThemeToggle />
          </div>

          <button
            onClick={handleLogout}
            title={sidebarCollapsed ? "Log Out" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-all w-full",
              sidebarCollapsed ? "justify-center px-2 py-3" : "px-3 py-2.5",
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </div>

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

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-950/50 relative">
        {/* Mobile Header */}
        <header className="lg:hidden flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <span className="font-bold">B</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white">BusTrack</span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <Menu className="h-6 w-6" />
          </button>
        </header>

        {/* Desktop Header - Minimalist */}
        <header className="hidden lg:flex h-16 items-center justify-between px-8 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
              {navigation.find(n => n.href === pathname)?.name || 'Dashboard'}
            </h2>
          </div>

          {/* Global Search Bar (Elasticsearch Style) */}
          <div className="flex-1 max-w-2xl mx-8 relative">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-12 py-2.5 border-none rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-sm"
                placeholder="Search stations, routes, dates... (e.g. 'Marrakech', 'Tomorrow')"
                value={globalSearchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => globalSearchQuery.length > 2 && setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin text-indigo-500" /> : (
                  <div className="hidden sm:flex items-center gap-1">
                    <span className="text-xs text-slate-400 font-medium px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">⌘K</span>
                  </div>
                )}
              </div>
            </div>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-[100] animate-in slide-in-from-top-2">
                <div className="p-2">
                  <div className="text-xs font-bold text-slate-400 px-3 py-2 uppercase tracking-wider">Top Results</div>
                  {searchResults.map((result: any, i) => (
                    <button key={i} onClick={() => handleSelectResult(result)} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left group">
                      <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/30">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white truncate">{result.display_name.split(',')[0]}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[300px]">{result.display_name}</div>
                      </div>
                      <div className="ml-auto">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 px-2 py-1 rounded hidden group-hover:inline-block">Navigate</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Date Picker Integration Hint */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <CalendarIcon className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-500">Filter by Date:</span>
                  <input type="date" className="bg-transparent border-none text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-0 p-0" onChange={(e) => setSearchDate(new Date(e.target.value))} />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* System Status - Minimal */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">System Operational</span>
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

            {/* Notifications */}
            <CustomDropdown
              trigger={
                <button className="relative p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-slate-950" />
                </button>
              }
              width="w-80"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-sm">Notifications</span>
                <span className="text-xs text-indigo-600 cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="p-4 text-center text-sm text-slate-500">
                No new notifications
              </div>
            </CustomDropdown>

            {/* User Profile */}
            <CustomDropdown
              trigger={
                <button className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-900 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800">
                  <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden ring-2 ring-white dark:ring-slate-950 shadow-sm">
                    <img src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff" alt="Admin" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium text-slate-900 dark:text-white leading-none">Admin User</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Administrator</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 rotate-90" />
                </button>
              }
            >
              <div className="py-1">
                <DropdownItem icon={User}>Profile</DropdownItem>
                <DropdownItem icon={Settings}>Settings</DropdownItem>
                <DropdownDivider />
                <DropdownItem icon={LogOut} className="text-red-600" onClick={handleLogout}>Log Out</DropdownItem>
              </div>
            </CustomDropdown>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950/50 p-4 sm:p-8">
          {children}
        </main>

        <AdminMobileNav />
      </div>
    </div>
  )
}

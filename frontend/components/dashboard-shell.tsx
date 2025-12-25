"use client"

import type React from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

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
  HelpCircle,
  Shield,
  BellRing,
  ScanLine,
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
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogout = () => {
    setShowLogoutDialog(true)
  }

  const confirmLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 text-foreground font-sans selection:bg-primary/20">
      {/* Mobile sidebar backdrop - Removed as we switched to bottom nav */}

      {/* Sidebar - Desktop Only */}
      <div
        className={cn(
          "hidden lg:flex flex-col border-r border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-20" : "w-72",
        )}
      >
        <div
          className={cn(
            "flex h-20 items-center border-b border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-800",
            sidebarCollapsed ? "justify-center px-4" : "justify-between px-6",
          )}
        >
          <div className={cn("flex items-center gap-3", sidebarCollapsed && "lg:gap-0")}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30">
              <Bus className="h-7 w-7 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
                Bus<span className="text-blue-500">Track</span>
              </span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto">
          {!sidebarCollapsed && (
            <div className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Main Menu
            </div>
          )}
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                title={sidebarCollapsed ? item.name : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200",
                  sidebarCollapsed ? "justify-center px-3 py-3" : "px-4 py-3",
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white",
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors flex-shrink-0",
                    isActive ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-blue-500",
                  )}
                />
                {!sidebarCollapsed && (
                  <>
                    <span className="truncate">{item.name}</span>
                    {isActive && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    )}
                  </>
                )}
              </Link>
            )
          })}

          {!sidebarCollapsed && (
            <div className="mt-8 mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              System
            </div>
          )}
          <Link
            href="/notifications"
            title={sidebarCollapsed ? "Notifications" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-xl text-sm font-medium transition-all",
              sidebarCollapsed ? "justify-center px-3 py-3" : "px-4 py-3",
              pathname === "/notifications"
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white",
            )}
          >
            <Bell
              className={cn(
                "h-5 w-5 flex-shrink-0 transition-colors",
                pathname === "/notifications" ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-blue-500"
              )}
            />
            {!sidebarCollapsed && (
              <>
                <span>Notifications</span>
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                  3
                </span>
              </>
            )}
          </Link>
        </nav>

        <div className="border-t border-slate-200/60 dark:border-slate-700/60 p-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-800">
          <button
            onClick={handleLogout}
            title={sidebarCollapsed ? "Log Out" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-all w-full",
              sidebarCollapsed ? "justify-center px-3 py-3" : "px-4 py-3",
            )}
          >
            <LogOut className="h-5 w-5 text-slate-500 dark:text-slate-400 group-hover:text-red-500 flex-shrink-0" />
            {!sidebarCollapsed && <span>Log Out</span>}
          </button>
        </div>

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex absolute -right-3 top-24 h-6 w-6 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all z-50"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

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

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-950/50 relative">
        <header className="absolute top-4 left-4 right-4 z-50 flex h-16 items-center justify-between rounded-2xl border border-white/20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl px-4 sm:px-6 shadow-lg shadow-slate-200/20 dark:shadow-black/20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden md:flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-emerald-600 dark:text-emerald-400">System Operational</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications Dropdown */}
            <div className="hidden sm:block">
              <CustomDropdown
                trigger={
                  <button className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse" />
                  </button>
                }
                width="w-80"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                  <span className="font-semibold text-card-foreground text-sm">Notifications</span>
                  <span className="text-xs text-primary cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <div className="px-4 py-3 border-b border-border/20 hover:bg-muted/30 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <Video className="h-4 w-4 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm text-card-foreground">Camera Offline</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Camera #4 (West Gate) lost connection.</p>
                        <p className="text-[10px] text-muted-foreground mt-1.5">2 min ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 border-b border-border/20 hover:bg-muted/30 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Bus className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-card-foreground">Route Completed</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Bus 101 finished Route A schedule.</p>
                        <p className="text-[10px] text-muted-foreground mt-1.5">15 min ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 hover:bg-muted/30 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <CreditCard className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-sm text-card-foreground">Payment Received</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Daily settlement processed successfully.</p>
                        <p className="text-[10px] text-muted-foreground mt-1.5">1 hr ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2 border-t border-border/50">
                  <button className="w-full py-2 text-xs font-medium text-center text-muted-foreground hover:text-card-foreground transition-colors">
                    View all notifications
                  </button>
                </div>
              </CustomDropdown>
            </div>

            <div className="relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                className="block w-full p-2 pl-10 text-sm text-foreground border-0 bg-slate-100 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 placeholder-slate-400"
                placeholder="Search..."
              />
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2" />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile Dropdown */}
            <CustomDropdown
              trigger={
                <button className="flex items-center gap-2 sm:gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 p-[2px] shadow-lg shadow-blue-500/20">
                    <div className="h-full w-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                      <img src="https://ui-avatars.com/api/?name=Abdellah+Halmaoui&background=random" alt="AH" className="rounded-full" />
                    </div>
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Abdellah H.</p>
                  </div>
                </button>
              }
            >
              <div className="px-4 py-3 border-b border-border/50">
                <p className="text-sm font-medium text-card-foreground">Abdellah Halmaoui</p>
                <p className="text-xs text-muted-foreground">abdellah.h@bustrack.com</p>
              </div>
              <div className="py-1">
                <DropdownItem icon={User}>My Profile</DropdownItem>
                <DropdownItem icon={Settings}>Account Settings</DropdownItem>
                <DropdownItem icon={Shield}>Security</DropdownItem>
                <DropdownItem icon={BellRing}>Notifications</DropdownItem>
              </div>
              <DropdownDivider />
              <div className="py-1">
                <DropdownItem icon={HelpCircle}>Help & Support</DropdownItem>
                <DropdownItem
                  icon={LogOut}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={handleLogout}
                >
                  Log Out
                </DropdownItem>
              </div>
            </CustomDropdown>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pt-24 pb-24 lg:pb-0 px-4 sm:px-6">{children}</main>

        {/* Mobile Navigation */}
        <AdminMobileNav />
      </div>
    </div>
  )
}

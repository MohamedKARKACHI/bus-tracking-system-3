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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CustomDropdown, DropdownItem, DropdownDivider } from "@/components/ui/custom-dropdown"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Live Tracking", href: "/tracking", icon: Map },
  { name: "Fleet Management", href: "/fleet", icon: Bus },
  { name: "ANPR Cameras", href: "/cameras", icon: Video },
  { name: "Drivers & Users", href: "/drivers", icon: Users },
  { name: "Analytics", href: "/analytics", icon: PieChart },
  { name: "Payments", href: "/payments", icon: CreditCard },
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
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          sidebarCollapsed ? "lg:w-20" : "w-72",
          "flex flex-col border-r border-border bg-card/80 backdrop-blur-xl",
        )}
      >
        <div
          className={cn(
            "flex h-20 items-center border-b border-border/50",
            sidebarCollapsed ? "justify-center px-4" : "justify-between px-6",
          )}
        >
          <div className={cn("flex items-center gap-3", sidebarCollapsed && "lg:gap-0")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-lg shadow-primary/20">
              <Bus className="h-6 w-6 text-primary-foreground" />
            </div>
            {!sidebarCollapsed && (
              <span className="text-xl font-bold tracking-tight text-card-foreground">
                Bus<span className="text-primary">Track</span>
              </span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted/50 lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
          {!sidebarCollapsed && (
            <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors flex-shrink-0",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground",
                  )}
                />
                {!sidebarCollapsed && (
                  <>
                    <span className="truncate">{item.name}</span>
                    {isActive && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-primary-foreground shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                    )}
                  </>
                )}
              </Link>
            )
          })}

          {!sidebarCollapsed && (
            <div className="mt-8 mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Bell
              className={cn(
                "h-5 w-5 flex-shrink-0 transition-colors",
                pathname === "/notifications" ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
              )}
            />
            {!sidebarCollapsed && (
              <>
                <span>Notifications</span>
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                  3
                </span>
              </>
            )}
          </Link>
        </nav>

        <div className="border-t border-border p-4">
          <button
            onClick={handleLogout}
            title={sidebarCollapsed ? "Log Out" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-all w-full",
              sidebarCollapsed ? "justify-center px-3 py-3" : "px-4 py-3",
            )}
          >
            <LogOut className="h-5 w-5 text-muted-foreground group-hover:text-red-400 flex-shrink-0" />
            {!sidebarCollapsed && <span>Log Out</span>}
          </button>
        </div>

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex absolute -right-3 top-24 h-6 w-6 items-center justify-center rounded-full border border-border bg-card shadow-lg text-muted-foreground hover:text-card-foreground hover:bg-muted/50 transition-all z-50"
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
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="relative z-30 flex h-20 items-center justify-between border-b border-border bg-card/50 backdrop-blur-md px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted/50 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              System Operational
            </span>
            <span className="text-muted-foreground">|</span>
            <span>Last updated: just now</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications Dropdown */}
            <div className="hidden sm:block">
              <CustomDropdown
                trigger={
                  <button className="relative p-2 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)] animate-pulse" />
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
                className="block w-full p-2.5 pl-10 text-sm text-foreground border border-border rounded-xl bg-card/50 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 placeholder-muted-foreground"
                placeholder="Search buses, drivers..."
              />
            </div>

            <div className="h-8 w-px bg-border mx-2" />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile Dropdown */}
            <CustomDropdown
              trigger={
                <button className="flex items-center gap-2 sm:gap-3 rounded-full bg-card/50 py-1.5 pl-1.5 pr-3 sm:pr-4 border border-border hover:border-primary/50 hover:bg-card/80 transition-all">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-cyan-400 p-[1px]">
                    <div className="h-full w-full rounded-full bg-card flex items-center justify-center">
                      <span className="text-xs font-bold text-card-foreground">AH</span>
                    </div>
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-medium text-foreground">Abdellah Halmaoui</p>
                    <p className="text-[10px] text-muted-foreground">Admin</p>
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

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

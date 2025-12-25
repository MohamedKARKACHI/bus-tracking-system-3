import { useState } from "react"
import { Bell, X, AlertCircle, CheckCircle2, Info, Settings, Gauge, LogOut, User } from "lucide-react"
import { useDriverSidebar } from "@/lib/driver-sidebar-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DriverPortalHeader() {
  const { toggleSidebar } = useDriverSidebar()
  const { logout, user } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, type: "info", title: "Route Update", message: "Your route schedule has been updated for tomorrow", time: "5 min ago" },
    { id: 2, type: "success", title: "Trip Completed", message: "Downtown Loop trip marked as completed", time: "15 min ago" },
    { id: 3, type: "warning", title: "Traffic Alert", message: "Heavy traffic detected on Main Street", time: "30 min ago" },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 border-b border-border/50 dark:border-border/30 bg-card/95 dark:bg-card/90 backdrop-blur-xl shadow-sm lg:hidden">
        {/* Left: Logo/Title (Replaces Hamburger) */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
            <Gauge className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Driver Portal</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-cyan-500/10 dark:hover:from-blue-500/5 dark:hover:to-cyan-500/5 transition-all hover:scale-110 relative"
          >
            <Bell className="h-5 w-5 text-foreground dark:text-foreground" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 animate-pulse shadow-lg shadow-blue-500/50" />
          </button>

          <div className="ml-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  suppressHydrationWarning
                  className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 hover:scale-105 transition-transform cursor-pointer"
                >
                  <span className="text-xs font-bold text-white">{user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'JD'}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Notifications Panel */}
      {showNotifications && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-45 lg:hidden"
            onClick={() => setShowNotifications(false)}
          />
          <div className="fixed top-16 right-4 w-80 max-w-[calc(100vw-2rem)] bg-card/95 backdrop-blur-xl border-2 border-border rounded-xl shadow-2xl z-50 lg:hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-bold text-foreground">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      notif.type === "info" && "bg-blue-500/20",
                      notif.type === "success" && "bg-emerald-500/20",
                      notif.type === "warning" && "bg-amber-500/20"
                    )}>
                      {notif.type === "info" && <Info className="h-4 w-4 text-blue-500" />}
                      {notif.type === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                      {notif.type === "warning" && <AlertCircle className="h-4 w-4 text-amber-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground">{notif.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}

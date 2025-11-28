"use client"

import { useState } from "react"
import { Menu, Bell, X, AlertCircle, CheckCircle2, Info } from "lucide-react"
import { useDriverSidebar } from "@/lib/driver-sidebar-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

export function DriverPortalHeader() {
  const { toggleSidebar } = useDriverSidebar()
  const [showNotifications, setShowNotifications] = useState(false)
  
  const notifications = [
    { id: 1, type: "info", title: "Route Update", message: "Your route schedule has been updated for tomorrow", time: "5 min ago" },
    { id: 2, type: "success", title: "Trip Completed", message: "Downtown Loop trip marked as completed", time: "15 min ago" },
    { id: 3, type: "warning", title: "Traffic Alert", message: "Heavy traffic detected on Main Street", time: "30 min ago" },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 border-b border-border/50 dark:border-border/30 bg-card/95 dark:bg-card/90 backdrop-blur-xl shadow-sm lg:hidden">
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-cyan-500/10 dark:hover:from-blue-500/5 dark:hover:to-cyan-500/5 transition-all hover:scale-110"
        >
          <Menu className="h-6 w-6 text-foreground dark:text-foreground" />
        </button>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20">
            <span className="text-xs sm:text-sm font-bold text-white">JD</span>
          </div>
          <span className="text-sm sm:text-base font-semibold text-foreground dark:text-foreground">John Driver</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-cyan-500/10 dark:hover:from-blue-500/5 dark:hover:to-cyan-500/5 transition-all hover:scale-110 relative"
          >
            <Bell className="h-5 w-5 text-foreground dark:text-foreground" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 animate-pulse shadow-lg shadow-blue-500/50" />
          </button>
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

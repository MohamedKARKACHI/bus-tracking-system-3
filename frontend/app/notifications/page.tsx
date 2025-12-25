"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardShell } from "@/components/dashboard-shell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  BellRing,
  Video,
  Bus,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Trash2,
  Settings,
} from "lucide-react"

interface Notification {
  id: string
  type: "info" | "warning" | "success" | "error"
  title: string
  message: string
  timestamp: string
  read: boolean
  icon: any
}

export default function NotificationsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "warning",
      title: "Camera Offline",
      message: "Camera #4 (West Gate) lost connection. Last seen 2 minutes ago.",
      timestamp: "2 min ago",
      read: false,
      icon: Video,
    },
    {
      id: "2",
      type: "success",
      title: "Route Completed",
      message: "Bus 101 has successfully completed Route A schedule on time.",
      timestamp: "15 min ago",
      read: false,
      icon: Bus,
    },
    {
      id: "3",
      type: "info",
      title: "Payment Received",
      message: "Daily settlement of $2,450 has been processed successfully.",
      timestamp: "1 hr ago",
      read: false,
      icon: CreditCard,
    },
    {
      id: "4",
      type: "error",
      title: "Bus Breakdown",
      message: "Bus 205 reported engine trouble on Route B. Driver requested assistance.",
      timestamp: "2 hrs ago",
      read: true,
      icon: AlertTriangle,
    },
    {
      id: "5",
      type: "success",
      title: "Maintenance Completed",
      message: "Bus 102 maintenance check completed. Vehicle back in service.",
      timestamp: "3 hrs ago",
      read: true,
      icon: CheckCircle2,
    },
    {
      id: "6",
      type: "info",
      title: "New Driver Assigned",
      message: "Sarah Johnson has been assigned to Route C starting tomorrow.",
      timestamp: "5 hrs ago",
      read: true,
      icon: Bell,
    },
  ])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user && user.role !== "admin") {
      if (user.role === "driver") {
        router.push("/driver-portal")
      } else {
        router.push("/client-portal")
      }
    }
  }, [user, isLoading, router])

  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-amber-500/20 text-amber-500 border-amber-500/30"
      case "success":
        return "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
      case "error":
        return "bg-red-500/20 text-red-500 border-red-500/30"
      default:
        return "bg-blue-500/20 text-blue-500 border-blue-500/30"
    }
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <BellRing className="h-8 w-8 text-primary" />
              Notifications
            </h1>
            <p className="text-muted-foreground mt-1">
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <GlassCard className="divide-y divide-border">
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">No notifications</h3>
              <p className="text-sm text-muted-foreground">You're all caught up! Check back later.</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const IconComponent = notification.icon
              return (
                <div
                  key={notification.id}
                  className={`p-6 transition-colors ${
                    !notification.read ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-accent/30"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 h-12 w-12 rounded-xl border-2 flex items-center justify-center ${getTypeStyles(
                        notification.type
                      )}`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{notification.title}</h3>
                            {!notification.read && (
                              <Badge variant="default" className="h-5 px-2 text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{notification.message}</p>
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{notification.timestamp}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs hover:bg-primary/20"
                            >
                              Mark Read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </GlassCard>
      </div>
    </DashboardShell>
  )
}

"use client"

import { useState } from "react"
import { useTheme } from "@/lib/theme-context"
import {
    Bell, Bus, Ticket, Gift, AlertTriangle, Check, Trash2, CheckCheck
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
    id: number
    type: 'trip' | 'promo' | 'alert' | 'system'
    title: string
    message: string
    time: string
    read: boolean
}

export default function NotificationsPage() {
    const { isDark } = useTheme()
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: 1, type: 'trip', title: 'Trip Reminder', message: 'Your trip to Marrakech departs in 2 hours. Don\'t forget your ticket!', time: '2 hours ago', read: false },
        { id: 2, type: 'promo', title: '🎉 25% Off Weekend Trips!', message: 'Book any trip this weekend and save 25%. Limited time offer!', time: '5 hours ago', read: false },
        { id: 3, type: 'alert', title: 'Route Update', message: 'Route 42 has been temporarily rerouted due to road construction.', time: 'Yesterday', read: true },
        { id: 4, type: 'system', title: 'Welcome to PremiumBus!', message: 'Thank you for joining. Explore our routes and book your first trip.', time: '2 days ago', read: true },
    ])

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'trip': return Bus
            case 'promo': return Gift
            case 'alert': return AlertTriangle
            case 'system': return Bell
            default: return Bell
        }
    }

    const getIconColor = (type: Notification['type']) => {
        switch (type) {
            case 'trip': return 'bg-blue-500/10 text-blue-500'
            case 'promo': return 'bg-purple-500/10 text-purple-500'
            case 'alert': return 'bg-amber-500/10 text-amber-500'
            case 'system': return 'bg-emerald-500/10 text-emerald-500'
            default: return 'bg-slate-500/10 text-slate-500'
        }
    }

    const markAsRead = (id: number) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
    }

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }

    const deleteNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }

    const clearAll = () => {
        setNotifications([])
    }

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <div className="max-w-2xl mx-auto px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className={cn("text-2xl sm:text-3xl font-bold mb-1", isDark ? "text-white" : "text-slate-900")}>
                        Notifications
                    </h1>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                        {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                    </p>
                </div>

                <div className="flex gap-2">
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors",
                                isDark
                                    ? "bg-white/5 text-slate-300 hover:bg-white/10"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            )}
                        >
                            <CheckCheck className="w-4 h-4" />
                            <span className="hidden sm:inline">Mark all read</span>
                        </button>
                    )}
                    {notifications.length > 0 && (
                        <button
                            onClick={clearAll}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors",
                                isDark
                                    ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                                    : "bg-rose-50 text-rose-500 hover:bg-rose-100"
                            )}
                        >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Clear all</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
                <div className={cn(
                    "text-center py-16 rounded-3xl border",
                    isDark ? "bg-slate-900/50 border-white/5" : "bg-white border-slate-200"
                )}>
                    <Bell className={cn("w-12 h-12 mx-auto mb-4", isDark ? "text-slate-600" : "text-slate-300")} />
                    <p className={cn("font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                        No notifications
                    </p>
                    <p className={cn("text-sm mt-1", isDark ? "text-slate-500" : "text-slate-400")}>
                        You're all caught up!
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => {
                        const Icon = getIcon(notification.type)
                        return (
                            <div
                                key={notification.id}
                                className={cn(
                                    "group relative p-4 rounded-2xl border transition-all",
                                    !notification.read && (isDark ? "border-blue-500/20" : "border-blue-200"),
                                    notification.read
                                        ? isDark ? "bg-slate-900/30 border-white/5" : "bg-slate-50 border-slate-100"
                                        : isDark ? "bg-slate-800/80" : "bg-white"
                                )}
                            >
                                {/* Unread Indicator */}
                                {!notification.read && (
                                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                )}

                                <div className="flex gap-4">
                                    {/* Icon */}
                                    <div className={cn("p-3 rounded-xl shrink-0", getIconColor(notification.type))}>
                                        <Icon className="w-5 h-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h3 className={cn(
                                                "font-bold text-sm sm:text-base truncate",
                                                isDark ? "text-white" : "text-slate-900"
                                            )}>
                                                {notification.title}
                                            </h3>
                                            <span className={cn("text-xs shrink-0", isDark ? "text-slate-500" : "text-slate-400")}>
                                                {notification.time}
                                            </span>
                                        </div>
                                        <p className={cn(
                                            "text-sm line-clamp-2",
                                            isDark ? "text-slate-400" : "text-slate-600"
                                        )}>
                                            {notification.message}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex gap-2 mt-3">
                                            {!notification.read && (
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className={cn(
                                                        "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors",
                                                        isDark
                                                            ? "bg-white/5 text-slate-300 hover:bg-white/10"
                                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                    )}
                                                >
                                                    <Check className="w-3 h-3" /> Mark read
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteNotification(notification.id)}
                                                className={cn(
                                                    "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors",
                                                    isDark
                                                        ? "text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                                                        : "text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                                                )}
                                            >
                                                <Trash2 className="w-3 h-3" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

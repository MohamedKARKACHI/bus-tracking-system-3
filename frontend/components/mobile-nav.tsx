"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Tag, ShoppingCart, User, Map, Bell, Calendar, Navigation, LayoutDashboard, MessageSquare, Clock, Menu, AlertCircle, TrendingUp, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

export function MobileNav() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const mainNavItems = [
        {
            name: "Dashboard",
            href: "/driver-portal",
            icon: LayoutDashboard,
            label: "Dashboard"
        },
        {
            name: "Track",
            href: "/driver-portal/track-route",
            icon: Map,
            label: "Track"
        },
        {
            name: "Routes",
            href: "/driver-portal/routes",
            icon: Navigation,
            label: "Routes"
        },
        {
            name: "Messages",
            href: "/driver-portal/messages",
            icon: MessageSquare,
            label: "Messages"
        }
    ]

    const moreNavItems = [
        {
            name: "Profile",
            href: "/driver-portal/settings",
            icon: User,
            description: "Settings and preferences"
        },
        {
            name: "Schedule",
            href: "/driver-portal/schedule",
            icon: Clock,
            description: "View your upcoming shifts"
        },
        {
            name: "Incidents",
            href: "/driver-portal/incidents",
            icon: AlertCircle,
            description: "Report and view incidents"
        },
        {
            name: "Performance",
            href: "/driver-portal/performance",
            icon: TrendingUp,
            description: "Check your driving stats"
        }
    ]

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <div className={cn(
                "fixed bottom-6 left-4 right-4 z-[100] lg:hidden transition-all duration-500 ease-in-out",
                open ? "translate-y-[200%] opacity-0" : "translate-y-0 opacity-100"
            )}>
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-full shadow-2xl shadow-blue-500/20 p-2">
                    <nav className="flex items-center justify-between px-2">
                        {mainNavItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-center p-3 rounded-full transition-all duration-300 ease-out",
                                        isActive
                                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30 px-5 gap-2"
                                            : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {isActive ? (
                                        <span className="font-bold text-sm whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">{item.label}</span>
                                    ) : (
                                        <span className="sr-only">{item.label}</span>
                                    )}
                                </Link>
                            )
                        })}

                        {/* More Menu Trigger */}
                        <SheetTrigger asChild>
                            <button
                                className={cn(
                                    "flex items-center justify-center p-3 rounded-full transition-all duration-300 ease-out",
                                    open
                                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30 px-5 gap-2"
                                        : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                )}
                            >
                                <Menu className="h-5 w-5" />
                                {open ? (
                                    <span className="font-bold text-sm whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">More</span>
                                ) : (
                                    <span className="sr-only">More</span>
                                )}
                            </button>
                        </SheetTrigger>
                    </nav>
                </div>
            </div>

            <SheetContent side="bottom" className="rounded-t-[32px] max-h-[85vh] p-0 border-t-0">
                <SheetHeader className="p-6 pb-2">
                    <SheetTitle className="text-left text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Menu</SheetTitle>
                </SheetHeader>
                <div className="p-4 grid gap-3">
                    {moreNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 hover:bg-muted border border-border/50 transition-all active:scale-[0.98]"
                        >
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center">
                                <item.icon className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-foreground">{item.name}</h3>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground/50" />
                        </Link>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}

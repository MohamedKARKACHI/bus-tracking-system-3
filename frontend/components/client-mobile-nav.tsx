"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Map, Ticket, Clock, Menu, User, Wallet, Settings, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function ClientMobileNav() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const mainNavItems = [
        { name: "Home", href: "/client-portal", icon: Home },
        { name: "Track", href: "/client-portal/track-bus", icon: Map },
        { name: "Book", href: "/client-portal/book-ticket", icon: Ticket },
        { name: "Tickets", href: "/client-portal/my-tickets", icon: Clock }
    ]

    const moreNavItems = [
        { name: "Profile", href: "/client-portal/profile", icon: User },
        { name: "Wallet", href: "/client-portal/history", icon: Wallet },
        { name: "Settings", href: "/client-portal/settings", icon: Settings }
    ]

    return (
        <>
            {/* Bottom Nav Bar */}
            <div className={cn(
                "fixed bottom-4 left-4 right-4 z-[100] lg:hidden transition-all duration-300",
                open ? "translate-y-[200%] opacity-0" : "translate-y-0 opacity-100"
            )}>
                <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-cyan-500/10 p-2">
                    <nav className="flex items-center justify-between">
                        {mainNavItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-center p-3 rounded-xl transition-all duration-300",
                                        isActive
                                            ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30 px-5 gap-2"
                                            : "text-white/40 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {isActive && (
                                        <span className="font-medium text-sm">{item.name}</span>
                                    )}
                                </Link>
                            )
                        })}
                        <button
                            onClick={() => setOpen(true)}
                            className="flex items-center justify-center p-3 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </nav>
                </div>
            </div>

            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Bottom Sheet */}
            <div className={cn(
                "fixed bottom-0 left-0 right-0 z-[101] lg:hidden transition-transform duration-300 ease-out",
                open ? "translate-y-0" : "translate-y-full"
            )}>
                <div className="bg-slate-900 border-t border-white/10 rounded-t-3xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            Menu
                        </h2>
                        <button
                            onClick={() => setOpen(false)}
                            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {moreNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 transition-all"
                            >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                                    <item.icon className="w-5 h-5 text-cyan-400" />
                                </div>
                                <span className="flex-1 font-medium text-white">{item.name}</span>
                                <ChevronRight className="w-5 h-5 text-white/20" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

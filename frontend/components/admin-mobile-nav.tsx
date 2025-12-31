"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
    LayoutDashboard,
    Map,
    Bus,
    Menu,
    Users,
    Video,
    PieChart,
    CreditCard,
    Shield,
    Settings,
    ChevronRight,
    ScanLine,
    LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

export function AdminMobileNav() {
    const pathname = usePathname()
    const router = useRouter()
    const { logout } = useAuth()
    const [open, setOpen] = useState(false)
    const [showLogoutDialog, setShowLogoutDialog] = useState(false)

    const handleLogout = () => {
        setOpen(false)
        setShowLogoutDialog(true)
    }

    const confirmLogout = () => {
        logout()
        router.push("/login")
    }

    const mainNavItems = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
            label: "Dashboard"
        },
        {
            name: "Tracking",
            href: "/tracking",
            icon: Map,
            label: "Tracking"
        },
        {
            name: "Fleet",
            href: "/fleet",
            icon: Bus,
            label: "Fleet"
        }
    ]

    const moreNavItems = [
        {
            name: "Drivers & Users",
            href: "/drivers",
            icon: Users,
            description: "Manage personnel"
        },
        {
            name: "Check-in/Out",
            href: "/checkin-checkout",
            icon: ScanLine,
            description: "Automated entry logs"
        },
        {
            name: "ANPR Cameras",
            href: "/cameras",
            icon: Video,
            description: "Surveillance feeds"
        },
        {
            name: "Analytics",
            href: "/analytics",
            icon: PieChart,
            description: "System performance"
        },
        {
            name: "Payments",
            href: "/payments",
            icon: CreditCard,
            description: "Revenue tracking"
        },
        {
            name: "ID Cards",
            href: "/id-cards",
            icon: Shield,
            description: "Card management"
        },
        {
            name: "Settings",
            href: "/settings",
            icon: Settings,
            description: "System configuration"
        }
    ]

    return (
        <>
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
                    <div className="p-4 grid gap-3 overflow-y-auto max-h-[70vh]">
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

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 transition-all active:scale-[0.98]"
                        >
                            <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                                <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="font-semibold text-red-600 dark:text-red-400">Log Out</h3>
                                <p className="text-xs text-red-500/70 dark:text-red-400/70">Sign out of your account</p>
                            </div>
                        </button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Logout Confirmation Dialog */}
            {
                showLogoutDialog && (
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
                )
            }
        </>
    )
}

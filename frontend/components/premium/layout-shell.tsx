"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/lib/theme-context"
import {
    LogOut, ChevronLeft, Moon, Sun,
    Compass, Home, ChevronRight, Ticket, User, Bell, X, AlertTriangle, MessageCircle, Search, MapPin, Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import axios from "axios"
import "@/app/client-portal/premium.css"

interface PremiumLayoutShellProps {
    children: React.ReactNode
}

export function PremiumLayoutShell({ children }: PremiumLayoutShellProps) {
    const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(false)
    const [showLogoutModal, setShowLogoutModal] = React.useState(false)
    const [showSearch, setShowSearch] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isSearching, setIsSearching] = React.useState(false)
    const [searchResults, setSearchResults] = React.useState<any[]>([])
    const [showResults, setShowResults] = React.useState(false)
    const { theme, isDark, toggleTheme } = useTheme()
    const pathname = usePathname()
    const router = useRouter()
    const { user, logout } = useAuth()

    const handleLogout = () => {
        setShowLogoutModal(false)
        logout()
    }

    const navigation = [
        { name: 'Home', href: '/client-portal', icon: Home },
        { name: 'Book', href: '/client-portal/book-ticket', icon: Compass },
        { name: 'Tickets', href: '/client-portal/my-tickets', icon: Ticket },
        { name: 'Support', href: '/client-portal/support', icon: MessageCircle },
        { name: 'Profile', href: '/client-portal/profile', icon: User },
    ]

    const handleSearch = async (query: string) => {
        setSearchQuery(query)
        if (query.length > 2) {
            setIsSearching(true)
            try {
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
        setShowResults(false)
        setShowSearch(false)
        setSearchQuery("")
        router.push(`/client-portal/track-bus?lat=${result.lat}&lon=${result.lon}&name=${encodeURIComponent(result.display_name.split(',')[0])}`)
    }

    return (
        <div className={cn(
            "min-h-screen flex transition-colors duration-300 relative overflow-hidden font-[family-name:var(--font-inter)]",
            isDark ? "bg-[#0f172a] text-slate-100" : "bg-slate-50 text-slate-900"
        )}>

            {/* Background Decor */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                <div className={cn(
                    "absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-30",
                    isDark ? "bg-indigo-600" : "bg-emerald-500/20"
                )} />
                <div className={cn(
                    "absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-30",
                    isDark ? "bg-purple-600" : "bg-blue-500/20"
                )} />
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className={cn(
                        "relative w-[90%] max-w-sm p-6 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300",
                        isDark ? "bg-slate-900" : "bg-white"
                    )}>
                        <button
                            onClick={() => setShowLogoutModal(false)}
                            className={cn(
                                "absolute top-4 right-4 p-2 rounded-full transition-colors",
                                isDark ? "hover:bg-white/10 text-slate-400" : "hover:bg-slate-100 text-slate-500"
                            )}
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center">
                            <div className={cn(
                                "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center",
                                isDark ? "bg-rose-500/20" : "bg-rose-100"
                            )}>
                                <AlertTriangle className="w-8 h-8 text-rose-500" />
                            </div>

                            <h3 className={cn("text-xl font-bold mb-2", isDark ? "text-white" : "text-slate-900")}>
                                Sign Out?
                            </h3>
                            <p className={cn("text-sm mb-6", isDark ? "text-slate-400" : "text-slate-500")}>
                                Are you sure you want to sign out of your account?
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className={cn(
                                        "flex-1 py-3 rounded-xl font-bold transition-colors",
                                        isDark
                                            ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    )}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 py-3 rounded-xl font-bold bg-rose-500 text-white hover:bg-rose-600 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Bottom Bar */}
            <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50 animate-in slide-in-from-bottom-10 duration-700">
                <nav className={cn(
                    "backdrop-blur-xl border rounded-[2rem] p-2 shadow-2xl flex justify-between items-center relative",
                    isDark
                        ? "bg-slate-900/90 border-white/10"
                        : "bg-white/90 border-slate-200"
                )}>
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative flex-1 flex flex-col items-center justify-center py-3 rounded-[1.5rem] transition-all duration-300",
                                    isActive
                                        ? "text-white"
                                        : isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-emerald-500 rounded-[1.5rem] -z-10 shadow-lg shadow-emerald-500/30" />
                                )}
                                <div className={cn(
                                    "p-1 transition-transform duration-300",
                                    isActive ? "scale-110" : ""
                                )}>
                                    <item.icon className={cn("w-5 h-5", isActive ? "w-6 h-6" : "")} />
                                </div>
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Mobile Top Bar */}
            <div className={cn(
                "lg:hidden fixed top-0 left-0 right-0 z-40 px-6 py-4 flex justify-between items-center backdrop-blur-sm",
                isDark
                    ? "bg-gradient-to-b from-slate-900 via-slate-900/80 to-transparent"
                    : "bg-gradient-to-b from-white via-white/80 to-transparent"
            )}>
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border",
                        isDark ? "bg-slate-800 border-white/10" : "bg-slate-100 border-slate-200"
                    )}>
                        <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                    </div>
                    <div>
                        <p className={cn("text-xs font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Good Morning,</p>
                        <p className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>{user?.name?.split(' ')[0] || 'Traveler'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowSearch(true)}
                        className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                            isDark
                                ? "bg-slate-800 text-slate-300 hover:text-emerald-400"
                                : "bg-slate-100 text-slate-500 hover:text-emerald-500"
                        )}
                    >
                        <Search className="w-5 h-5" />
                    </button>
                    <button
                        onClick={toggleTheme}
                        className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                            isDark
                                ? "bg-slate-800 text-slate-300 hover:text-emerald-400"
                                : "bg-slate-100 text-slate-500 hover:text-emerald-500"
                        )}
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                            isDark
                                ? "bg-slate-800 text-rose-400 hover:bg-rose-500/20"
                                : "bg-slate-100 text-rose-500 hover:bg-rose-100"
                        )}
                        title="Sign Out"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Search Overlay */}
            {showSearch && (
                <div className="fixed inset-0 z-[100] flex flex-col animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSearch(false)} />
                    <div className={cn(
                        "relative mx-4 mt-4 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300",
                        isDark ? "bg-slate-900" : "bg-white"
                    )}>
                        <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-700">
                            <Search className="w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search stations, routes, locations..."
                                className={cn(
                                    "flex-1 bg-transparent border-none outline-none text-base",
                                    isDark ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400"
                                )}
                            />
                            {isSearching && <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />}
                            <button onClick={() => setShowSearch(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {showResults && searchResults.length > 0 && (
                            <div className="max-h-80 overflow-y-auto">
                                {searchResults.map((result: any, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSelectResult(result)}
                                        className={cn(
                                            "w-full flex items-center gap-3 p-4 text-left transition-colors",
                                            isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center",
                                            isDark ? "bg-emerald-500/20" : "bg-emerald-50"
                                        )}>
                                            <MapPin className="w-5 h-5 text-emerald-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn("font-medium truncate", isDark ? "text-white" : "text-slate-900")}>
                                                {result.display_name.split(',')[0]}
                                            </p>
                                            <p className={cn("text-xs truncate", isDark ? "text-slate-400" : "text-slate-500")}>
                                                {result.display_name}
                                            </p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-400" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {searchQuery.length > 2 && searchResults.length === 0 && !isSearching && (
                            <div className="p-8 text-center">
                                <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                                    No results found for "{searchQuery}"
                                </p>
                            </div>
                        )}

                        {searchQuery.length <= 2 && (
                            <div className="p-6">
                                <p className={cn("text-sm text-center", isDark ? "text-slate-500" : "text-slate-400")}>
                                    Type at least 3 characters to search
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "hidden lg:flex fixed inset-y-0 left-0 z-50 flex-col py-8 backdrop-blur-md border-r transition-all duration-300 ease-in-out",
                    isSidebarExpanded ? "w-[260px]" : "w-[80px]",
                    isDark
                        ? "bg-slate-900/80 border-white/10"
                        : "bg-white/80 border-slate-200"
                )}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                    className="absolute -right-3 top-12 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform z-50"
                >
                    {isSidebarExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {/* Logo Area */}
                <div className={cn(
                    "flex items-center gap-4 mb-12 px-4 w-full transition-all duration-300",
                    isSidebarExpanded ? "justify-start px-6" : "justify-center"
                )}>
                    <div className="w-10 h-10 min-w-[40px] rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Compass className="w-6 h-6 text-white" />
                    </div>
                    <span className={cn(
                        "font-bold text-xl tracking-tight whitespace-nowrap transition-all duration-300 overflow-hidden",
                        isDark ? "text-white" : "text-slate-900",
                        isSidebarExpanded ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"
                    )}>
                        PremiumBus
                    </span>
                </div>

                {/* Search Button */}
                <button
                    onClick={() => setShowSearch(true)}
                    className={cn(
                        "mx-3 mb-4 flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-300",
                        isDark
                            ? "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700",
                        isSidebarExpanded ? "justify-start" : "justify-center"
                    )}
                >
                    <Search className="w-5 h-5 min-w-[20px]" />
                    <span className={cn(
                        "text-sm font-medium whitespace-nowrap transition-all duration-300",
                        isSidebarExpanded ? "opacity-100 max-w-[150px]" : "opacity-0 max-w-0"
                    )}>
                        Search...
                    </span>
                </button>

                {/* Nav Items */}
                <nav className="flex-1 flex flex-col gap-2 w-full px-3">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative flex items-center gap-4 px-3 py-3 rounded-2xl transition-all duration-300 group/item overflow-hidden",
                                    isActive
                                        ? isDark
                                            ? "bg-slate-800 text-emerald-400 shadow-lg"
                                            : "bg-white text-emerald-500 shadow-lg"
                                        : isDark
                                            ? "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                                    isSidebarExpanded ? "" : "justify-center"
                                )}
                            >
                                <item.icon className={cn("w-6 h-6 min-w-[24px]", isActive && "scale-110")} />
                                <span className={cn(
                                    "font-medium whitespace-nowrap transition-all duration-300 overflow-hidden",
                                    isSidebarExpanded ? "opacity-100 max-w-[150px]" : "opacity-0 max-w-0"
                                )}>
                                    {item.name}
                                </span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-auto w-full px-3">
                    <button
                        onClick={toggleTheme}
                        className={cn(
                            "flex items-center gap-4 px-3 py-3 rounded-2xl transition-all w-full overflow-hidden",
                            isDark
                                ? "text-slate-400 hover:text-emerald-400 hover:bg-slate-800/50"
                                : "text-slate-500 hover:text-emerald-500 hover:bg-slate-100",
                            isSidebarExpanded ? "justify-start" : "justify-center"
                        )}
                        title="Toggle Theme"
                    >
                        {isDark ? <Sun className="w-5 h-5 min-w-[20px]" /> : <Moon className="w-5 h-5 min-w-[20px]" />}
                        <span className={cn(
                            "font-medium whitespace-nowrap transition-all duration-300",
                            isSidebarExpanded ? "opacity-100 max-w-[150px]" : "opacity-0 max-w-0"
                        )}>
                            {isDark ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    </button>
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className={cn(
                            "flex items-center gap-4 px-3 py-3 rounded-2xl text-rose-500 transition-all w-full overflow-hidden",
                            isDark ? "hover:bg-rose-900/20" : "hover:bg-rose-50",
                            isSidebarExpanded ? "justify-start" : "justify-center"
                        )}
                        title="Sign Out"
                    >
                        <LogOut className="w-5 h-5 min-w-[20px]" />
                        <span className={cn(
                            "font-medium whitespace-nowrap transition-all duration-300",
                            isSidebarExpanded ? "opacity-100 max-w-[150px]" : "opacity-0 max-w-0"
                        )}>
                            Sign Out
                        </span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={cn(
                "flex-1 min-w-0 h-screen overflow-y-auto relative z-10 transition-all duration-300 ease-in-out",
                isSidebarExpanded ? "lg:pl-[260px]" : "lg:pl-[80px]"
            )}>
                <div className="max-w-7xl mx-auto p-6 pt-24 lg:p-10 lg:pt-10 min-h-full animate-in fade-in duration-700 slide-in-from-bottom-4 pb-32 lg:pb-10">
                    {children}
                </div>
            </main>

        </div>
    )
}

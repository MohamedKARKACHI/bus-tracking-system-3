"use client"

import { useState } from "react"
import {
    Bus,
    MapPin,
    Navigation,
    ChevronRight,
    AlertCircle,
    TrendingUp,
    X,
    Maximize,
    Minimize
} from "lucide-react"
import { BusMap } from "@/components/bus-map"
import { cn } from "@/lib/utils"

interface FullscreenMapModalProps {
    isOpen: boolean
    onClose: () => void
    routes?: any[]
}

export function FullscreenMapModal({ isOpen, onClose, routes: providedRoutes }: FullscreenMapModalProps) {
    if (!isOpen) return null

    const defaultRoutes = [
        { id: 1, name: "Route Casa-Marrakech", distance: "2.5 km", status: "Active", color: "#10b981", buses: 3 },
        { id: 2, name: "Route Airport Line", distance: "4.2 km", status: "Active", color: "#3b82f6", buses: 2 },
        { id: 3, name: "Route Medina Express", distance: "1.8 km", status: "Active", color: "#f59e0b", buses: 4 },
        { id: 4, name: "Route Gueliz Loop", distance: "3.1 km", status: "Active", color: "#8b5cf6", buses: 2 },
        { id: 5, name: "Route Palm Station", distance: "5.0 km", status: "Active", color: "#ec4899", buses: 1 },
    ]

    const routes = providedRoutes || defaultRoutes

    return (
        <div className="fixed inset-0 z-[100] flex bg-white dark:bg-slate-900 animate-in fade-in duration-200">
            {/* Sidebar - Theme Aware */}
            <div className="w-80 lg:w-96 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-xl z-20">
                {/* Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors group"
                                title="Exit Fullscreen"
                            >
                                <X className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:scale-110 transition-transform" />
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="bg-indigo-600 p-1 rounded-md">
                                    <Bus className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-bold text-slate-900 dark:text-white">BusTrack Map</span>
                            </div>
                        </div>
                        <button className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors">
                            <AlertCircle className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search routes or stations..."
                            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-700 rounded flex items-center justify-center shadow-sm">
                            <Navigation className="w-3 h-3 text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filters:</span>
                        <button className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-medium border border-indigo-200 dark:border-indigo-500/30">
                            Active Only
                        </button>
                        <button className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700">
                            Nearest
                        </button>
                    </div>
                </div>

                {/* Route List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {routes.map((route) => (
                        <div
                            key={route.id}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                        >
                            {/* Route Icon */}
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                                style={{ backgroundColor: route.color + '20' }}
                            >
                                <Bus className="w-5 h-5" style={{ color: route.color }} />
                            </div>

                            {/* Route Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-900 dark:text-white truncate text-sm">{route.name}</h4>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-slate-500 dark:text-slate-400">{route.distance}</span>
                                    <span className="text-slate-300 dark:text-slate-600">•</span>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">{route.status}</span>
                                </div>
                            </div>

                            {/* Buses Count */}
                            <div className="flex items-center gap-1 text-slate-400 group-hover:text-indigo-500 transition-colors bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                                <span className="text-xs font-bold">{route.buses}</span>
                                <Bus className="w-3 h-3" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Stats */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                            <Bus className="w-4 h-4 text-indigo-500" />
                            <span>12 Active Buses</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-emerald-500" />
                            <span>24 Stops</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Map Area */}
            <div className="flex-1 relative bg-slate-100 dark:bg-slate-950">
                <BusMap height="100%" showControls={true} />

                {/* Floating Info Card */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-sm w-full mx-4 z-10 hidden sm:block">
                    <div className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-2xl">
                        <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center">
                                <Bus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-slate-900 dark:text-white">Marrakech Central</h4>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">• Active Hub</p>
                            </div>
                            <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                <Minimize className="w-4 h-4 text-slate-400" />
                            </button>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">
                            <span className="flex items-center gap-1">🚌 5 buses</span>
                            <span className="flex items-center gap-1">⏱ Open 24h</span>
                            <span className="flex items-center gap-1">📍 Main Station</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                            Main transit hub serving all major routes in Marrakech city center.
                        </p>
                        <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-indigo-200 dark:shadow-none">
                            View Schedule
                        </button>
                    </div>
                </div>

                {/* Map Attribution and Controls Overlay */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                    <div className="bg-white dark:bg-slate-900 p-2 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex flex-col gap-2">
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors" title="Zoom In">+</button>
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors" title="Zoom Out">-</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

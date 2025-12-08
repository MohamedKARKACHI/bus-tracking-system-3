"use client"

import { Bus, Users, TrendingUp, DollarSign, Activity, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
    title: string
    value: string | number
    change?: string
    changeType?: "increase" | "decrease" | "neutral"
    icon: React.ElementType
    gradient: string
    delay?: number
}

function StatCard({ title, value, change, changeType, icon: Icon, gradient, delay = 0 }: StatCardProps) {
    return (
        <div
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            style={{ animationDelay: `${delay}ms` }}
        >
            {/* Gradient background on hover */}
            <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300",
                gradient
            )} />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                        "p-3 rounded-xl",
                        gradient,
                        "shadow-lg"
                    )}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>

                    {change && (
                        <div className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold",
                            changeType === "increase" ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400" :
                                changeType === "neutral" ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400" :
                                    "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400"
                        )}>
                            {change}
                        </div>
                    )}
                </div>

                <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
                </div>
            </div>
        </div>
    )
}

export function AdminStatsCards() {
    const stats = [
        {
            title: "Total Fleet",
            value: 16,
            change: "+2 this week",
            changeType: "increase" as const,
            icon: Bus,
            gradient: "bg-gradient-to-br from-blue-500 to-cyan-500"
        },
        {
            title: "Active Drivers",
            value: 12,
            change: "On duty",
            changeType: "neutral" as const,
            icon: Users,
            gradient: "bg-gradient-to-br from-purple-500 to-pink-500"
        },
        {
            title: "Today's Revenue",
            value: "$2,847",
            change: "+12.5%",
            changeType: "increase" as const,
            icon: DollarSign,
            gradient: "bg-gradient-to-br from-emerald-500 to-teal-500"
        },
        {
            title: "Tickets Booked",
            value: 247,
            change: "+18 today",
            changeType: "increase" as const,
            icon: Activity,
            gradient: "bg-gradient-to-br from-amber-500 to-orange-500"
        },
        {
            title: "On-Time Rate",
            value: "94%",
            change: "+2.1%",
            changeType: "increase" as const,
            icon: Clock,
            gradient: "bg-gradient-to-br from-rose-500 to-pink-500"
        },
        {
            title: "Total Trips",
            value: 156,
            change: "This month",
            changeType: "neutral" as const,
            icon: TrendingUp,
            gradient: "bg-gradient-to-br from-violet-500 to-purple-500"
        }
    ]

    return (
        <>
            {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <div
                        key={stat.title}
                        className="relative overflow-hidden rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    >
                        {/* Gradient background on hover */}
                        <div className={cn(
                            "absolute inset-0 opacity-0 hover:opacity-10 transition-opacity duration-300",
                            stat.gradient
                        )} />

                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-2">
                                <div className={cn(
                                    "p-2 rounded-lg",
                                    stat.gradient,
                                    "shadow-md"
                                )}>
                                    <Icon className="h-4 w-4 text-white" />
                                </div>

                                {stat.change && (
                                    <div className={cn(
                                        "px-2 py-0.5 rounded-full text-xs font-bold",
                                        stat.changeType === "increase" && "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
                                        stat.changeType === "decrease" && "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400",
                                        stat.changeType === "neutral" && "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                    )}>
                                        {stat.change}
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{stat.title}</p>
                                <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    )
}

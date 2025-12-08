"use client"

import { Bus, Users, DollarSign, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function AdminQuickStats() {
    const quickStats = [
        {
            label: "Fleet",
            value: "16",
            subtext: "Active",
            icon: Bus,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-100 dark:bg-blue-950"
        },
        {
            label: "Drivers",
            value: "12",
            subtext: "On Duty",
            icon: Users,
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-100 dark:bg-purple-950"
        },
        {
            label: "Revenue",
            value: "$2.8k",
            subtext: "Today",
            icon: DollarSign,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-100 dark:bg-emerald-950"
        },
        {
            label: "Trips",
            value: "156",
            subtext: "Month",
            icon: TrendingUp,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-100 dark:bg-amber-950"
        }
    ]

    return (
        <div className="grid grid-cols-2 gap-3">
            {quickStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <div
                        key={stat.label}
                        className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 hover:scale-105"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg", stat.bg)}>
                                <Icon className={cn("h-4 w-4", stat.color)} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</p>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-500">{stat.subtext}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

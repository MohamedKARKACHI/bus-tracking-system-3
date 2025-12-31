"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface FuturisticCardProps {
    children: React.ReactNode
    className?: string
    variant?: "glass" | "glow" | "gradient-border" | "solid"
    hover?: boolean
    onClick?: () => void
}

export function FuturisticCard({
    children,
    className,
    variant = "glass",
    hover = true,
    onClick
}: FuturisticCardProps) {
    const baseStyles = "relative rounded-3xl overflow-hidden transition-all duration-300"

    const variantStyles = {
        glass: "bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]",
        glow: "bg-white/[0.03] backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_30px_rgba(0,212,255,0.15)]",
        "gradient-border": "bg-slate-900/80 backdrop-blur-xl",
        solid: "bg-slate-900 border border-slate-800"
    }

    const hoverStyles = hover
        ? "hover:translate-y-[-4px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3),0_0_30px_rgba(0,212,255,0.2)] cursor-pointer"
        : ""

    return (
        <div
            className={cn(baseStyles, variantStyles[variant], hoverStyles, className)}
            onClick={onClick}
        >
            {variant === "gradient-border" && (
                <div
                    className="absolute inset-0 rounded-3xl p-[1px] pointer-events-none"
                    style={{
                        background: "linear-gradient(135deg, #00d4ff, #8b5cf6)",
                        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude"
                    }}
                />
            )}
            {children}
        </div>
    )
}

// Mini stat card for dashboard
interface StatCardProps {
    label: string
    value: string | number
    icon: React.ReactNode
    trend?: { value: number; positive: boolean }
    color?: "cyan" | "purple" | "emerald" | "amber"
}

export function StatCard({ label, value, icon, trend, color = "cyan" }: StatCardProps) {
    const colorStyles = {
        cyan: "from-cyan-500 to-blue-500",
        purple: "from-purple-500 to-pink-500",
        emerald: "from-emerald-500 to-cyan-500",
        amber: "from-amber-500 to-orange-500"
    }

    return (
        <FuturisticCard variant="glass" className="p-5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-white/50 text-sm font-medium mb-1">{label}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                    {trend && (
                        <p className={cn(
                            "text-xs font-medium mt-2 flex items-center gap-1",
                            trend.positive ? "text-emerald-400" : "text-rose-400"
                        )}>
                            {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
                        </p>
                    )}
                </div>
                <div className={cn(
                    "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center",
                    colorStyles[color]
                )}>
                    {icon}
                </div>
            </div>
        </FuturisticCard>
    )
}

// Action card with icon
interface ActionCardProps {
    title: string
    subtitle?: string
    icon: React.ReactNode
    onClick?: () => void
    color?: "cyan" | "purple" | "emerald" | "amber"
}

export function ActionCard({ title, subtitle, icon, onClick, color = "cyan" }: ActionCardProps) {
    const colorStyles = {
        cyan: "from-cyan-500/20 to-blue-500/20 group-hover:from-cyan-500/30 group-hover:to-blue-500/30",
        purple: "from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30",
        emerald: "from-emerald-500/20 to-cyan-500/20 group-hover:from-emerald-500/30 group-hover:to-cyan-500/30",
        amber: "from-amber-500/20 to-orange-500/20 group-hover:from-amber-500/30 group-hover:to-orange-500/30"
    }

    const iconColors = {
        cyan: "text-cyan-400",
        purple: "text-purple-400",
        emerald: "text-emerald-400",
        amber: "text-amber-400"
    }

    return (
        <div
            onClick={onClick}
            className="group cursor-pointer"
        >
            <FuturisticCard variant="glass" className="p-5 group-hover:border-cyan-500/30">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center transition-all",
                        colorStyles[color]
                    )}>
                        <div className={cn("transition-transform group-hover:scale-110", iconColors[color])}>
                            {icon}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold text-lg group-hover:text-cyan-400 transition-colors">
                            {title}
                        </h3>
                        {subtitle && (
                            <p className="text-white/40 text-sm">{subtitle}</p>
                        )}
                    </div>
                </div>
            </FuturisticCard>
        </div>
    )
}

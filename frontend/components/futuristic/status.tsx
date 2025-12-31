"use client"

import React from "react"
import { cn } from "@/lib/utils"

// Status Badge with pulse animation
interface StatusBadgeProps {
    status: "active" | "boarding" | "in-transit" | "arrived" | "delayed" | "cancelled" | "pending"
    size?: "sm" | "md"
    showDot?: boolean
}

export function StatusBadge({ status, size = "md", showDot = true }: StatusBadgeProps) {
    const statusConfig = {
        active: { label: "Active", color: "emerald", bg: "bg-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-500" },
        boarding: { label: "Boarding", color: "cyan", bg: "bg-cyan-500/20", text: "text-cyan-400", dot: "bg-cyan-500" },
        "in-transit": { label: "In Transit", color: "blue", bg: "bg-blue-500/20", text: "text-blue-400", dot: "bg-blue-500" },
        arrived: { label: "Arrived", color: "emerald", bg: "bg-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-500" },
        delayed: { label: "Delayed", color: "amber", bg: "bg-amber-500/20", text: "text-amber-400", dot: "bg-amber-500" },
        cancelled: { label: "Cancelled", color: "rose", bg: "bg-rose-500/20", text: "text-rose-400", dot: "bg-rose-500" },
        pending: { label: "Pending", color: "slate", bg: "bg-slate-500/20", text: "text-slate-400", dot: "bg-slate-500" }
    }

    const config = statusConfig[status]
    const sizeStyles = size === "sm" ? "text-xs px-2 py-1" : "text-sm px-3 py-1.5"

    return (
        <span className={cn(
            "inline-flex items-center gap-2 rounded-full font-medium",
            config.bg,
            config.text,
            sizeStyles
        )}>
            {showDot && (
                <span className="relative flex h-2 w-2">
                    <span className={cn(
                        "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
                        config.dot
                    )} />
                    <span className={cn(
                        "relative inline-flex rounded-full h-2 w-2",
                        config.dot
                    )} />
                </span>
            )}
            {config.label}
        </span>
    )
}

// Progress indicator with glow
interface ProgressBarProps {
    value: number
    max?: number
    color?: "cyan" | "purple" | "emerald"
    size?: "sm" | "md"
    showLabel?: boolean
}

export function ProgressBar({ value, max = 100, color = "cyan", size = "md", showLabel = false }: ProgressBarProps) {
    const percentage = Math.min((value / max) * 100, 100)

    const colorStyles = {
        cyan: "from-cyan-500 to-blue-500",
        purple: "from-purple-500 to-pink-500",
        emerald: "from-emerald-500 to-cyan-500"
    }

    const glowStyles = {
        cyan: "shadow-[0_0_10px_rgba(0,212,255,0.5)]",
        purple: "shadow-[0_0_10px_rgba(139,92,246,0.5)]",
        emerald: "shadow-[0_0_10px_rgba(16,185,129,0.5)]"
    }

    const sizeHeight = size === "sm" ? "h-1" : "h-2"

    return (
        <div className="w-full">
            <div className={cn("bg-white/[0.05] rounded-full overflow-hidden", sizeHeight)}>
                <div
                    className={cn(
                        "h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out",
                        colorStyles[color],
                        glowStyles[color]
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {showLabel && (
                <div className="flex justify-between mt-1 text-xs text-white/40">
                    <span>{value}</span>
                    <span>{max}</span>
                </div>
            )}
        </div>
    )
}

// Countdown timer with flip effect
interface CountdownProps {
    targetDate: Date
    size?: "sm" | "md" | "lg"
}

export function Countdown({ targetDate, size = "md" }: CountdownProps) {
    const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    React.useEffect(() => {
        const calculateTime = () => {
            const now = new Date().getTime()
            const target = targetDate.getTime()
            const diff = target - now

            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
                return
            }

            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000)
            })
        }

        calculateTime()
        const timer = setInterval(calculateTime, 1000)
        return () => clearInterval(timer)
    }, [targetDate])

    const sizeStyles = {
        sm: { box: "w-12 h-12", text: "text-lg", label: "text-[10px]" },
        md: { box: "w-16 h-16", text: "text-2xl", label: "text-xs" },
        lg: { box: "w-20 h-20", text: "text-3xl", label: "text-sm" }
    }

    const TimeBox = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center">
            <div className={cn(
                "rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center font-mono font-bold text-white",
                sizeStyles[size].box,
                sizeStyles[size].text
            )}>
                {String(value).padStart(2, '0')}
            </div>
            <span className={cn("text-white/40 mt-1 uppercase tracking-wider", sizeStyles[size].label)}>
                {label}
            </span>
        </div>
    )

    return (
        <div className="flex items-center gap-3">
            {timeLeft.days > 0 && <TimeBox value={timeLeft.days} label="Days" />}
            <TimeBox value={timeLeft.hours} label="Hours" />
            <TimeBox value={timeLeft.minutes} label="Min" />
            <TimeBox value={timeLeft.seconds} label="Sec" />
        </div>
    )
}

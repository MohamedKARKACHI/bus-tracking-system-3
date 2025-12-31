"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface PremiumCardProps {
    children: React.ReactNode
    className?: string
    noPadding?: boolean
    onClick?: () => void
    hover?: boolean
}

export function PremiumCard({
    children,
    className,
    noPadding = false,
    onClick,
    hover = false
}: PremiumCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "pm-bg-secondary border pm-border-color rounded-2xl shadow-sm transition-all duration-200",
                !noPadding && "p-6",
                hover && "hover:-translate-y-1 hover:shadow-lg hover:border-blue-500/30 cursor-pointer group",
                className
            )}
        >
            {children}
        </div>
    )
}

interface StatGridProps {
    children: React.ReactNode
    columns?: 2 | 3 | 4
}

export function StatGrid({ children, columns = 4 }: StatGridProps) {
    return (
        <div className={cn(
            "grid gap-4",
            "grid-cols-2", // Default mobile
            columns === 3 && "lg:grid-cols-3",
            columns === 4 && "lg:grid-cols-4"
        )}>
            {children}
        </div>
    )
}

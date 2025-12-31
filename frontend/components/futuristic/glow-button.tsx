"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface GlowButtonProps {
    children: React.ReactNode
    className?: string
    variant?: "primary" | "secondary" | "ghost" | "danger"
    size?: "sm" | "md" | "lg"
    disabled?: boolean
    loading?: boolean
    onClick?: () => void
}

export function GlowButton({
    children,
    className,
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    onClick
}: GlowButtonProps) {
    const baseStyles = "relative inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"

    const sizeStyles = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    }

    const variantStyles = {
        primary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] hover:scale-[1.02]",
        secondary: "bg-white/[0.05] border border-white/[0.1] text-white hover:bg-white/[0.1] hover:border-cyan-500/50",
        ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/[0.05]",
        danger: "bg-gradient-to-r from-rose-500 to-red-600 text-white hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:scale-[1.02]"
    }

    return (
        <button
            className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
            disabled={disabled || loading}
            onClick={onClick}
        >
            {/* Shine effect on hover */}
            <span className="absolute inset-0 overflow-hidden rounded-2xl">
                <span className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </span>

            {loading ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading...
                </span>
            ) : (
                <span className="relative z-10 flex items-center gap-2">{children}</span>
            )}
        </button>
    )
}

// Icon button with glow
interface IconButtonProps {
    icon: React.ReactNode
    className?: string
    variant?: "primary" | "ghost"
    onClick?: () => void
}

export function IconButton({ icon, className, variant = "ghost", onClick }: IconButtonProps) {
    const variantStyles = {
        primary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-[0_0_20px_rgba(0,212,255,0.4)]",
        ghost: "bg-white/[0.05] text-white/70 hover:text-white hover:bg-white/[0.1]"
    }

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                variantStyles[variant],
                className
            )}
        >
            {icon}
        </button>
    )
}

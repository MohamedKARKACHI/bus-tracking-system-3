"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface ActionShellProps {
    children: React.ReactNode
    className?: string
}

export function ActionShell({ children, className }: ActionShellProps) {
    return (
        <div className={cn(
            "fixed bottom-0 left-0 right-0 p-4 bg-[#0f172a]/80 backdrop-blur-xl border-t border-white/10 lg:hidden z-40 animate-in slide-in-from-bottom-full duration-300",
            className
        )}>
            {children}
        </div>
    )
}

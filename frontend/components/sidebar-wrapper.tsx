"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SidebarWrapperProps {
  children: ReactNode
  isExpanded: boolean
  className?: string
}

export function SidebarWrapper({ children, isExpanded, className }: SidebarWrapperProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-sidebar border-r border-border transition-all duration-200 z-40",
        isExpanded ? "w-72" : "w-20",
        "flex flex-col items-stretch",
        className,
      )}
    >
      {children}
    </aside>
  )
}

interface SidebarItemProps {
  icon: ReactNode
  label: string
  isExpanded: boolean
  isActive?: boolean
  onClick?: () => void
  className?: string
}

export function SidebarItem({ icon, label, isExpanded, isActive, onClick, className }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      title={!isExpanded ? label : undefined}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full",
        isExpanded ? "justify-start" : "justify-center px-3",
        isActive ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent",
        className,
      )}
    >
      {icon}
      {isExpanded && <span className="font-medium text-sm">{label}</span>}
    </button>
  )
}

"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: "left" | "right"
  width?: string
  className?: string
}

export function CustomDropdown({ trigger, children, align = "right", width = "w-56", className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full mt-2 origin-top-right rounded-xl bg-card border border-border shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-200 z-[100]",
            align === "right" ? "right-0" : "left-0",
            width,
            className,
          )}
        >
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  )
}

export function DropdownItem({
  children,
  onClick,
  className,
  icon: Icon,
}: { children: React.ReactNode; onClick?: () => void; className?: string; icon?: any }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors text-left",
        className,
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  )
}

export function DropdownHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">{children}</div>
  )
}

export function DropdownDivider() {
  return <div className="h-px bg-border/50 my-1" />
}

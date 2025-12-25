import type React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hover" | "active"
  glowColor?: "primary" | "secondary" | "accent" | "none"
}

export function GlassCard({ children, className, variant = "default", glowColor = "none", ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 relative overflow-hidden group",
        "bg-card/50 dark:bg-card/40 backdrop-blur-md border border-border",
        "shadow-lg shadow-black/5 dark:shadow-black/20",
        "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/20 before:to-transparent before:z-0 before:pointer-events-none",
        variant === "hover" &&
          "hover:bg-card/70 dark:hover:bg-card/60 hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1",
        // Glow effects
        glowColor === "primary" && "shadow-[0_0_30px_-10px_hsl(var(--primary))] border-primary/20",
        glowColor === "secondary" && "shadow-[0_0_30px_-10px_hsl(var(--secondary))] border-secondary/20",
        glowColor === "accent" && "shadow-[0_0_30px_-10px_hsl(var(--accent))] border-accent/20",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[1]" />

      {/* Content with highest z-index to ensure interactivity */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

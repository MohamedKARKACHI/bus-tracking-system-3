"use client"

import Link from "next/link"
import { useState } from "react"
import { Bus, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth-context"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuth()

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 dark:border-white/10 bg-background/95 dark:bg-slate-950/95 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
              <Bus className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground dark:text-white">
              Bus<span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Track</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#services"
              className="relative text-sm font-medium text-foreground dark:text-white hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors group"
            >
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="#technology"
              className="relative text-sm font-medium text-foreground dark:text-white hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors group"
            >
              Technology
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="#interfaces"
              className="relative text-sm font-medium text-foreground dark:text-white hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors group"
            >
              Interfaces
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="#pricing"
              className="relative text-sm font-medium text-foreground dark:text-white hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors group"
            >
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <Link
                href={
                  user.role === "admin" ? "/dashboard" : user.role === "driver" ? "/driver-portal" : "/client-portal"
                }
                className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all hover:-translate-y-0.5 hover:scale-105"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all hover:-translate-y-0.5 hover:scale-105"
              >
                Sign In
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-muted-foreground dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-cyan-500/10 dark:hover:bg-cyan-500/20 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 dark:border-white/10 bg-background/98 dark:bg-slate-950/98 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-6 space-y-4">
            <Link
              href="#services"
              className="block py-2 text-sm font-medium text-foreground dark:text-white hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="#technology"
              className="block py-2 text-sm font-medium text-foreground dark:text-white hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Technology
            </Link>
            <Link
              href="#interfaces"
              className="block py-2 text-sm font-medium text-foreground dark:text-white hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Interfaces
            </Link>
            <Link
              href="#pricing"
              className="block py-2 text-sm font-medium text-foreground dark:text-white hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            {user ? (
              <Link
                href={
                  user.role === "admin" ? "/dashboard" : user.role === "driver" ? "/driver-portal" : "/client-portal"
                }
                className="block w-full text-center px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="block w-full text-center px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

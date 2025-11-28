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
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-lg shadow-primary/20">
              <Bus className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Bus<span className="text-primary">Track</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#services"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Services
            </Link>
            <Link
              href="#technology"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Technology
            </Link>
            <Link
              href="#interfaces"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Interfaces
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <Link
                href={
                  user.role === "admin" ? "/dashboard" : user.role === "driver" ? "/driver-portal" : "/client-portal"
                }
                className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
              >
                Sign In
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-accent"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-6 space-y-4">
            <Link
              href="#services"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="#technology"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Technology
            </Link>
            <Link
              href="#interfaces"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Interfaces
            </Link>
            <Link
              href="#pricing"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            {user ? (
              <Link
                href={
                  user.role === "admin" ? "/dashboard" : user.role === "driver" ? "/driver-portal" : "/client-portal"
                }
                className="block w-full text-center px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-primary-foreground text-sm font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="block w-full text-center px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-primary-foreground text-sm font-semibold"
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

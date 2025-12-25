"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react"
import { useState } from "react"

export function CTASection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="relative overflow-hidden rounded-3xl p-1 shadow-2xl"
          onMouseMove={handleMouseMove}
        >
          {/* Animated gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 animate-gradient" />
          
          <div className="relative bg-background dark:bg-slate-900 rounded-3xl p-12 lg:p-16">
            {/* Mouse-following gradient */}
            <div 
              className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-cyan-500/30 to-blue-500/30 dark:from-cyan-500/20 dark:to-blue-500/20 blur-3xl transition-all duration-300 pointer-events-none"
              style={{
                left: `${mousePosition.x}px`,
                top: `${mousePosition.y}px`,
                transform: 'translate(-50%, -50%)'
              }}
            />

            {/* Background pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />

            <div className="relative z-10 text-center max-w-3xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 border border-cyan-500/20 dark:border-cyan-500/30 mb-6 animate-fade-in">
                <Sparkles className="h-4 w-4 text-cyan-500" />
                <span className="text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  Transform Morocco's Transit
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 animate-fade-in">
                <span className="text-foreground dark:text-white">Ready to Modernize</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
                  Your Fleet Operations?
                </span>
              </h2>
              
              <p className="text-lg text-muted-foreground dark:text-slate-300 mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
                Join Morocco Transit Services and other operators revolutionizing public transport across Marrakech, Casablanca, and Tangier.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <Link
                  href="/login"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/tracking"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-foreground/20 dark:border-white/20 bg-background/50 dark:bg-slate-800/50 backdrop-blur-sm text-foreground dark:text-white font-semibold hover:bg-accent dark:hover:bg-slate-800 transition-all duration-300 hover:border-primary"
                >
                  Try Live Demo
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm animate-fade-in" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                  <span className="text-muted-foreground dark:text-slate-400">Real-time GPS tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                  <span className="text-muted-foreground dark:text-slate-400">25+ stations coverage</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                  <span className="text-muted-foreground dark:text-slate-400">24/7 support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

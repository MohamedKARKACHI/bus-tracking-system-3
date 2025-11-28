"use client"

import Link from "next/link"
import { ArrowRight, Ticket } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now Live
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-foreground">The Future of</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Fleet Management
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Real-time tracking, AI-powered analytics, and seamless management for your entire fleet. Transform your
              operations with cutting-edge technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/book-ticket"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 text-primary-foreground font-semibold shadow-lg shadow-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/50 transition-all hover:-translate-y-0.5 animate-pulse"
              >
                <Ticket className="h-5 w-5" />
                Book Ticket Now
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-card border border-border text-card-foreground font-semibold hover:bg-accent transition-all"
              >
                Dashboard
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-8 justify-center lg:justify-start text-sm">
              <div>
                <p className="text-2xl font-bold text-foreground">10K+</p>
                <p className="text-muted-foreground">Active Buses</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">500+</p>
                <p className="text-muted-foreground">Fleet Operators</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">99.9%</p>
                <p className="text-muted-foreground">Uptime</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <img
                src="/modern-bus-tracking-dashboard-interface-3d.jpg"
                alt="Bus Tracking Dashboard"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 -z-10 w-full h-full bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-2xl blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}

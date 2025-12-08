"use client"

import Link from "next/link"
import { ArrowRight, Ticket, MapPin, Zap, Users, TrendingUp, Bus } from "lucide-react"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Dynamic gradient mesh background */}
      <div className="absolute inset-0 opacity-30 dark:opacity-50">
        <div
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 blur-[120px] transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            left: '10%',
            top: '20%'
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-[120px] transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${-mousePosition.x * 0.02}px, ${-mousePosition.y * 0.02}px)`,
            right: '10%',
            bottom: '20%'
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left-10 duration-1000">

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                Live in Morocco • 3 Cities
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
                <span className="block text-foreground dark:text-white">
                  Morocco's
                </span>
                <span className="block mt-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                  Smart Transit
                </span>
                <span className="block text-foreground dark:text-white mt-2">
                  Revolution
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground dark:text-slate-300 max-w-2xl leading-relaxed">
                Experience seamless bus travel across <span className="font-semibold text-cyan-500">Marrakech</span>, <span className="font-semibold text-blue-500">Casablanca</span> & <span className="font-semibold text-purple-500">Tangier</span>. Real-time tracking, instant booking, live updates.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/client-portal/book-ticket"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Ticket className="h-5 w-5 relative z-10" />
                <span className="relative z-10">Book Your Ticket</span>
                <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/tracking"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-foreground/10 dark:border-white/10 bg-background/50 backdrop-blur-sm text-foreground dark:text-white font-semibold hover:bg-foreground/5 dark:hover:bg-white/5 transition-all duration-300"
              >
                <MapPin className="h-5 w-5" />
                <span>Track Buses</span>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="space-y-2 group cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/20 group-hover:bg-cyan-500/20 dark:group-hover:bg-cyan-500/30 transition-colors">
                    <Bus className="h-5 w-5 text-cyan-500" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground dark:text-white">16</p>
                <p className="text-sm text-muted-foreground dark:text-slate-400">Active Buses</p>
              </div>

              <div className="space-y-2 group cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 group-hover:bg-blue-500/20 dark:group-hover:bg-blue-500/30 transition-colors">
                    <MapPin className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground dark:text-white">25</p>
                <p className="text-sm text-muted-foreground dark:text-slate-400">Bus Stops</p>
              </div>

              <div className="space-y-2 group cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 group-hover:bg-purple-500/20 dark:group-hover:bg-purple-500/30 transition-colors">
                    <Users className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground dark:text-white">24/7</p>
                <p className="text-sm text-muted-foreground dark:text-slate-400">Service</p>
              </div>
            </div>
          </div>

          {/* Right Visual - Interactive Cards */}
          <div className="relative animate-in fade-in slide-in-from-right-10 duration-1000 delay-300">

            {/* Main card container */}
            <div className="relative">

              {/* Floating cards */}
              <div className="absolute -top-8 -left-8 z-20 animate-float">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-6 shadow-2xl shadow-cyan-500/30 backdrop-blur-sm border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm font-medium">Live Tracking</p>
                      <p className="text-white text-2xl font-bold">Real-time GPS</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 -right-8 z-20 animate-float-delayed">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-6 shadow-2xl shadow-purple-500/30 backdrop-blur-sm border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm font-medium">Routes Active</p>
                      <p className="text-white text-2xl font-bold">10 Lines</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main dashboard image */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                <div className="relative bg-card dark:bg-slate-900 rounded-3xl overflow-hidden border border-border dark:border-white/10 shadow-2xl">
                  <img
                    src="/modern-bus-tracking-dashboard-interface-3d.jpg"
                    alt="Morocco Transit Dashboard"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 0.5s;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  )
}

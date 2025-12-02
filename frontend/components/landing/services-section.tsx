"use client"

import { MapPin, BarChart3, Video, Shield, Zap, Globe } from "lucide-react"
import { useState } from "react"

const services = [
  {
    icon: MapPin,
    title: "Real-Time GPS Tracking",
    description:
      "Monitor every bus across Marrakech, Casablanca, and Tangier in real-time with military-grade GPS precision.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description:
      "AI-powered insights optimize routes across Morocco's cities, reducing costs and improving passenger satisfaction.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Video,
    title: "Security Cameras",
    description: "Advanced surveillance and automated plate recognition for enhanced security at every stop.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Shield,
    title: "Driver Safety",
    description: "Monitor driver behavior across inter-city routes and maintain the highest safety standards.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Zap,
    title: "Instant Alerts",
    description: "Real-time notifications for delays, incidents, and critical events across all 25+ stations.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Globe,
    title: "Morocco-Wide Network",
    description: "Complete coverage across Morocco's major cities with seamless inter-city route management.",
    color: "from-indigo-500 to-blue-500",
  },
]

export function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-6">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powerful Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-foreground dark:text-white">Everything You Need for</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
              Morocco's Transit Network
            </span>
          </h2>
          <p className="text-lg text-muted-foreground dark:text-slate-300 max-w-2xl mx-auto">
            Comprehensive fleet management across all Moroccan cities with cutting-edge technology and real-time insights.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative p-6 rounded-2xl bg-background dark:bg-slate-900/50 border border-foreground/10 dark:border-white/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 dark:hover:shadow-primary/10 hover:-translate-y-1 hover:border-transparent animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient border on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl`} />
              
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 shadow-lg transform transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                <service.icon className="h-7 w-7 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold mb-2 text-foreground dark:text-white">
                {service.title}
              </h3>
              
              <p className="text-muted-foreground dark:text-slate-400 text-sm leading-relaxed">
                {service.description}
              </p>

              {/* Hover indicator */}
              <div className={`mt-4 flex items-center gap-2 text-sm font-medium bg-gradient-to-r ${service.color} bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity`}>
                <span>Learn more</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

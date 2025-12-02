"use client"

import { Cpu, Cloud, Satellite, Brain, Lock, Gauge } from "lucide-react"
import { useState } from "react"

const technologies = [
  {
    icon: Brain,
    name: "AI Route Optimization",
    description: "Smart algorithms optimize Morocco's inter-city routes in real-time",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Satellite,
    name: "Precision GPS",
    description: "Track 16+ buses across 25+ stations with military-grade accuracy",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Cloud,
    name: "Cloud Infrastructure",
    description: "99.9% uptime ensures continuous service across all cities",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Gauge,
    name: "Real-Time Updates",
    description: "Ultra-fast data transmission for instant bus location updates",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Lock,
    name: "Enterprise Security",
    description: "Bank-level encryption protects passenger and operational data",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Cpu,
    name: "Edge Computing",
    description: "Process route data locally for instant decision-making",
    color: "from-yellow-500 to-orange-500",
  },
]

export function TechnologiesSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <section 
      className="relative py-20 lg:py-32 bg-muted/30 dark:bg-slate-950/50 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
      
      {/* Mouse-following gradient */}
      <div 
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 dark:from-cyan-500/10 dark:to-blue-500/10 blur-3xl transition-all duration-300 pointer-events-none"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-6">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Advanced Technology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-foreground dark:text-white">Powered by</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
              Next-Gen Infrastructure
            </span>
          </h2>
          <p className="text-lg text-muted-foreground dark:text-slate-300 max-w-2xl mx-auto">
            Cutting-edge tech stack ensuring reliable, secure, and intelligent transit management across Morocco.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="group relative flex items-start gap-4 p-6 rounded-2xl bg-background/80 dark:bg-slate-900/80 backdrop-blur-sm border border-foreground/10 dark:border-white/10 hover:shadow-2xl hover:shadow-primary/20 dark:hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient glow on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${tech.color} opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl`} />
              
              <div className="flex-shrink-0">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tech.color} flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                  <tech.icon className="h-7 w-7 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1 text-foreground dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-cyan-500 group-hover:to-blue-500 transition-all">
                  {tech.name}
                </h3>
                <p className="text-sm text-muted-foreground dark:text-slate-400 leading-relaxed">
                  {tech.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

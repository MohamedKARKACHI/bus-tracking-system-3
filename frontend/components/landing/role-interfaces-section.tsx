"use client"

import Link from "next/link"
import { Shield, Truck, Users, ArrowRight, Check } from "lucide-react"
import { useState } from "react"

const roles = [
  {
    icon: Shield,
    title: "Admin Dashboard",
    description:
      "Full control over Morocco's fleet with real-time monitoring across Marrakech, Casablanca, and Tangier.",
    features: ["Fleet Analytics", "Driver Management (Mohamed KARKACHI & team)", "Payment Processing", "Security Cameras"],
    href: "/dashboard",
    gradient: "from-cyan-500 to-blue-500",
    tag: "For Fleet Managers",
  },
  {
    icon: Truck,
    title: "Driver Portal",
    description: "Streamlined interface for drivers managing inter-city routes and passenger communications.",
    features: ["Route Navigation (10 Routes)", "Schedule Management", "Incident Reporting", "Performance Tracking"],
    href: "/driver-portal",
    gradient: "from-orange-500 to-red-500",
    tag: "For Drivers",
  },
  {
    icon: Users,
    title: "Passenger Portal",
    description: "Track buses in real-time across 25+ stations and plan your journey across Morocco.",
    features: ["Live GPS Tracking", "Arrival Predictions", "Route Planning", "Ticket Booking (5-120 MAD)"],
    href: "/client-portal",
    gradient: "from-purple-500 to-pink-500",
    tag: "For Passengers",
  },
]

export function RoleInterfacesSection() {
  const [hoveredRole, setHoveredRole] = useState<number | null>(null)

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-6">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Role-Based Access</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-foreground dark:text-white">Custom Portals for</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
              Every User Type
            </span>
          </h2>
          <p className="text-lg text-muted-foreground dark:text-slate-300 max-w-2xl mx-auto">
            Purpose-built interfaces for fleet managers, drivers, and passengers with Morocco-specific features.
          </p>
        </div>

        <div className="space-y-8">
          {roles.map((role, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredRole(index)}
              onMouseLeave={() => setHoveredRole(null)}
              className={`group relative rounded-3xl bg-background/50 dark:bg-slate-900/50 backdrop-blur-sm border border-foreground/10 dark:border-white/10 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 dark:hover:shadow-primary/10 animate-fade-in ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${role.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
              
              <div className="grid lg:grid-cols-2 gap-8 items-center p-8 lg:p-12">
                <div className="space-y-6">
                  {/* Tag */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30">
                    <role.icon className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium text-primary">{role.tag}</span>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                    <role.icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold mb-3 text-foreground dark:text-white">
                      {role.title}
                    </h3>
                    <p className="text-muted-foreground dark:text-slate-400 leading-relaxed">
                      {role.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {role.features.map((feature, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-start gap-3 animate-fade-in"
                        style={{ animationDelay: `${(index * 150) + (idx * 50)}ms` }}
                      >
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r ${role.gradient} flex items-center justify-center mt-0.5`}>
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm text-foreground dark:text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={role.href}
                    className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r ${role.gradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 group/btn`}
                  >
                    <span>Explore Portal</span>
                    <ArrowRight className="h-5 w-5 transform group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Visual placeholder */}
                <div className="relative">
                  <div className={`relative aspect-video rounded-2xl bg-gradient-to-br ${role.gradient} p-1 shadow-2xl transform transition-all duration-500 ${hoveredRole === index ? 'scale-105 rotate-1' : ''}`}>
                    <div className="w-full h-full rounded-xl bg-slate-900 dark:bg-slate-950 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                      <role.icon className="h-24 w-24 text-white/20" />
                    </div>
                  </div>
                  {/* Floating gradient orb */}
                  <div className={`absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br ${role.gradient} rounded-full blur-3xl opacity-30 dark:opacity-20 animate-pulse`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

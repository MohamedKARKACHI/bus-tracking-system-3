import Link from "next/link"
import { Shield, Truck, Users, ArrowRight } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"

const roles = [
  {
    icon: Shield,
    title: "Admin Dashboard",
    description:
      "Complete control over your fleet with advanced analytics, driver management, and real-time monitoring.",
    features: ["Fleet Analytics", "Driver Management", "Payment Processing", "ANPR Integration"],
    href: "/dashboard",
    gradient: "from-blue-500 to-cyan-500",
    image: "/admin-dashboard-interface-dark-mode.jpg",
  },
  {
    icon: Truck,
    title: "Driver Portal",
    description: "Simplified interface for drivers to manage routes, track schedules, and communicate with dispatch.",
    features: ["Route Navigation", "Schedule Management", "Incident Reporting", "Performance Metrics"],
    href: "/driver-portal",
    gradient: "from-orange-500 to-red-500",
    image: "/driver-app-interface-mobile.jpg",
  },
  {
    icon: Users,
    title: "Passenger App",
    description: "Real-time tracking for passengers to see bus locations, arrival times, and route information.",
    features: ["Live Bus Tracking", "Arrival Predictions", "Route Planning", "Payment Integration"],
    href: "/tracking",
    gradient: "from-emerald-500 to-teal-500",
    image: "/passenger-tracking-app-interface.jpg",
  },
]

export function RoleInterfacesSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-foreground">Tailored Interfaces for</span>
            <br />
            <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
              Every User Role
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Purpose-built experiences for administrators, drivers, and passengers with role-specific features and
            workflows.
          </p>
        </div>

        <div className="space-y-12">
          {roles.map((role, index) => (
            <GlassCard key={index} className={`overflow-hidden ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="p-8 lg:p-12">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <role.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-foreground">{role.title}</h3>
                  <p className="text-muted-foreground mb-6">{role.description}</p>

                  <div className="space-y-3 mb-8">
                    {role.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${role.gradient}`} />
                        <span className="text-sm text-foreground/80">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={role.href}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${role.gradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105`}
                  >
                    Explore {role.title}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>

                <div className="relative p-8 lg:p-12">
                  <div className="relative z-10">
                    <img
                      src={role.image || "/placeholder.svg"}
                      alt={role.title}
                      className="w-full h-auto rounded-xl shadow-2xl"
                    />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-10 blur-3xl -z-10`} />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

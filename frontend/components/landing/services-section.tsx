import { MapPin, BarChart3, Video, Shield, Zap, Globe } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"

const services = [
  {
    icon: MapPin,
    title: "Real-Time Tracking",
    description:
      "Monitor your entire fleet in real-time with GPS precision. Get instant location updates and route history.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "AI-powered insights and predictive analytics to optimize routes, reduce costs, and improve efficiency.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Video,
    title: "ANPR Cameras",
    description: "Automated number plate recognition for enhanced security and seamless toll management.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Shield,
    title: "Driver Safety",
    description: "Monitor driver behavior, ensure compliance, and maintain the highest safety standards.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Zap,
    title: "Instant Alerts",
    description: "Get real-time notifications for delays, breakdowns, and critical events across your fleet.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Operate anywhere with our worldwide network and multi-language support.",
    color: "from-indigo-500 to-blue-500",
  },
]

export function ServicesSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-foreground">Powerful Features for</span>
            <br />
            <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
              Modern Fleet Management
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage, monitor, and optimize your fleet operations in one comprehensive platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <GlassCard key={index} className="p-6" variant="hover">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} p-0.5 mb-4 shadow-lg`}>
                <div className="w-full h-full rounded-xl bg-card/50 backdrop-blur flex items-center justify-center">
                  <service.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

import { Cpu, Cloud, Satellite, Brain, Lock, Gauge } from "lucide-react"

const technologies = [
  {
    icon: Brain,
    name: "AI Routing",
    description: "Machine learning algorithms optimize routes in real-time",
  },
  {
    icon: Satellite,
    name: "GPS Tracking",
    description: "Military-grade satellite positioning for accuracy",
  },
  {
    icon: Cloud,
    name: "Cloud Infrastructure",
    description: "99.9% uptime with auto-scaling capabilities",
  },
  {
    icon: Gauge,
    name: "5G Connectivity",
    description: "Ultra-fast data transmission and low latency",
  },
  {
    icon: Lock,
    name: "Enterprise Security",
    description: "Bank-level encryption and compliance certifications",
  },
  {
    icon: Cpu,
    name: "Edge Computing",
    description: "Process data locally for instant decision-making",
  },
]

export function TechnologiesSection() {
  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-foreground">Built with</span>
            <br />
            <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
              Cutting-Edge Technology
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Leveraging the latest innovations in AI, cloud computing, and IoT to deliver unparalleled performance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg hover:shadow-primary/10 transition-all"
            >
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg shadow-primary/20">
                  <tech.icon className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1 text-foreground">{tech.name}</h3>
                <p className="text-sm text-muted-foreground">{tech.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

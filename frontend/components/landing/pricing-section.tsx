import { Check, ArrowRight, Zap } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Single Ride",
    description: "Perfect for occasional travelers",
    price: "5",
    period: "per ride",
    features: ["Real-time bus tracking", "Digital ticket", "Route notifications", "Customer support"],
    cta: "Book Now",
    href: "/book-ticket",
    popular: false,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Monthly Pass",
    description: "Best value for daily commuters",
    price: "89",
    period: "per month",
    features: [
      "Unlimited rides",
      "Priority boarding",
      "Route planning",
      "Trip history",
      "Mobile app access",
      "Family sharing (up to 3)",
    ],
    cta: "Get Started",
    href: "/book-ticket",
    popular: true,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "Enterprise",
    description: "For businesses and organizations",
    price: "Custom",
    period: "contact us",
    features: [
      "Fleet management dashboard",
      "Employee accounts",
      "Analytics & reporting",
      "API access",
      "Dedicated support",
      "Custom integrations",
      "Volume discounts",
    ],
    cta: "Contact Sales",
    href: "/login",
    popular: false,
    gradient: "from-orange-500 to-red-500",
  },
]

export function PricingSection() {
  return (
    null
  )
}

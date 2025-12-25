import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { ServicesSection } from "@/components/landing/services-section"
import { TechnologiesSection } from "@/components/landing/technologies-section"
import { RoleInterfacesSection } from "@/components/landing/role-interfaces-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <div id="services">
        <ServicesSection />
      </div>
      <div id="technology">
        <TechnologiesSection />
      </div>
      <div id="interfaces">
        <RoleInterfacesSection />
      </div>
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  )
}

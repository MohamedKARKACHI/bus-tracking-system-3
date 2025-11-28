import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-600 to-cyan-500 p-1 shadow-2xl shadow-primary/30">
          <div className="relative bg-gradient-to-br from-background to-muted rounded-3xl p-12 lg:p-16">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />

            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Ready to Transform Your Fleet Management?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join hundreds of fleet operators who have revolutionized their operations with BusTrack.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                >
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-border bg-background/50 text-foreground font-semibold hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                >
                  Schedule a Demo
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

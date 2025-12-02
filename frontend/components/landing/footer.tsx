import Link from "next/link"
import { Bus, Mail, Phone, MapPin, Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-background dark:bg-slate-950">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 dark:to-primary/10 pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-primary/20">
                <Bus className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground dark:text-white">
                Bus<span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Track</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground dark:text-slate-400 mb-4 leading-relaxed">
              Morocco's premier smart transit solution connecting Marrakech, Casablanca, and Tangier.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-foreground/5 dark:bg-white/5 hover:bg-primary/10 dark:hover:bg-primary/20 flex items-center justify-center transition-colors group">
                <Twitter className="h-4 w-4 text-muted-foreground dark:text-slate-400 group-hover:text-primary" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-foreground/5 dark:bg-white/5 hover:bg-primary/10 dark:hover:bg-primary/20 flex items-center justify-center transition-colors group">
                <Linkedin className="h-4 w-4 text-muted-foreground dark:text-slate-400 group-hover:text-primary" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-foreground/5 dark:bg-white/5 hover:bg-primary/10 dark:hover:bg-primary/20 flex items-center justify-center transition-colors group">
                <Github className="h-4 w-4 text-muted-foreground dark:text-slate-400 group-hover:text-primary" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground dark:text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#services" className="text-sm text-muted-foreground dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#technology" className="text-sm text-muted-foreground dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="text-sm text-muted-foreground dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Live Tracking
                </Link>
              </li>
              <li>
                <Link href="/book-ticket" className="text-sm text-muted-foreground dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Book Tickets
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground dark:text-white mb-4">Access</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-sm text-muted-foreground dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link href="/driver-portal" className="text-sm text-muted-foreground dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Driver Portal
                </Link>
              </li>
              <li>
                <Link href="/client-portal" className="text-sm text-muted-foreground dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Passenger Portal
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-muted-foreground dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground dark:text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground dark:text-slate-400">
                <Mail className="h-4 w-4 text-primary" />
                contact@morocco-transit.ma
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground dark:text-slate-400">
                <Phone className="h-4 w-4 text-primary" />
                +212 5XX-XXXXXX
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground dark:text-slate-400">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>Marrakech, Casablanca,<br />Tangier, Morocco</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 dark:border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground dark:text-slate-400">
              © 2025 Morocco Transit Services. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-muted-foreground dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-muted-foreground dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

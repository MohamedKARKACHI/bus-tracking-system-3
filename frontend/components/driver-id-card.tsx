"use client"

import { useState, useEffect } from "react"
import { User, Bus, Shield, Award, QrCode, Camera } from "lucide-react"
import { cn } from "@/lib/utils"
import QRCode from "qrcode"

interface DriverIdCardProps {
  className?: string
  driver?: {
    id: string
    name: string
    email: string
    avatar?: string
    licenseNumber?: string
    busNumber?: string
    joinDate?: string
    rating?: number
  }
}

export function DriverIdCard({ driver, className }: DriverIdCardProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [isFlipped, setIsFlipped] = useState(false)

  const driverData = driver || {
    id: "DRV-2024-001",
    name: "Mohamed KARKACHI",
    email: "mohamed.k@bustrack.com",
    avatar: "/placeholder.svg",
    licenseNumber: "DL-MA-2024-12345",
    busNumber: "BUS-101",
    joinDate: "Jan 2024",
    rating: 4.8,
  }

  // Generate initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Generate QR Code
  useEffect(() => {
    const qrData = `NID: ${driverData.id}\nEmail: ${driverData.email}\nPhone: +212 600 000 000`

    QRCode.toDataURL(qrData, {
      width: 180,
      margin: 2,
      color: {
        dark: "#1e40af",
        light: "#ffffff",
      },
    }).then(setQrCodeUrl)
  }, [driverData])

  return (
    <div className={cn("w-full max-w-sm mx-auto perspective-[1000px]", className)}>
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer",
          !className?.includes("aspect-") && "aspect-[2/3]",
          isFlipped && "rotate-y-180"
        )}
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
      >
        {/* Front of Card */}
        <div className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden shadow-2xl">
          {/* Card Container */}
          <div className="relative w-full h-full bg-white dark:bg-slate-900 flex flex-col">
            {/* Top Curved Section with Company Branding */}
            <div className="relative h-36 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 overflow-hidden shrink-0">
              {/* Geometric Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 right-4 w-24 h-24 border-4 border-white/30 rounded-full" />
                <div className="absolute top-8 right-8 w-16 h-16 border-4 border-white/20 rounded-full" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-600/30 rounded-full blur-2xl" />
                <div className="absolute top-0 right-0 w-full h-full" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                  backgroundSize: '30px 30px'
                }} />
              </div>

              {/* Company Logo and Name */}
              <div className="relative px-6 pt-6 flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl blur-md opacity-60" />
                  <div className="relative h-12 w-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Bus className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl tracking-wide drop-shadow-lg">COMPANY NAME</h3>
                  <p className="text-blue-100 text-xs tracking-wider">MODERN ID CARD</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="relative px-6 -mt-16 pb-24 flex-1 flex flex-col z-10">
              {/* Photo Section */}
              <div className="flex justify-center mb-4 shrink-0">
                <div className="relative">
                  {/* Outer Glow */}
                  <div className="absolute -inset-2 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-40" />

                  {/* White Border */}
                  <div className="relative bg-white dark:bg-slate-800 rounded-full p-2 shadow-2xl">
                    {/* Photo Circle with Initials */}
                    <div className="relative h-28 w-28 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center overflow-hidden">
                      {driverData.avatar && driverData.avatar !== "/placeholder.svg" ? (
                        <img
                          src={driverData.avatar}
                          alt={driverData.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-4xl font-bold drop-shadow-lg">
                          {getInitials(driverData.name)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="text-center mb-4 shrink-0">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {driverData.name.toUpperCase()}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">LOREM IPSUM</p>
              </div>

              {/* QR Code */}
              <div className="flex-1 flex items-center justify-center mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-lg border-2 border-slate-200 dark:border-slate-700">
                  {qrCodeUrl && (
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="w-28 h-28"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Decorative Wave Elements - Outside main content to position at very bottom */}
            <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
              <svg viewBox="0 0 400 80" className="w-full" style={{ height: '80px' }} preserveAspectRatio="none">
                <path
                  d="M0,40 Q100,10 200,40 T400,40 L400,80 L0,80 Z"
                  fill="url(#waveGradient)"
                  opacity="0.9"
                />
                <defs>
                  <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl overflow-hidden shadow-2xl">
          <div className="relative w-full h-full bg-white dark:bg-slate-900">
            {/* Top Section */}
            <div className="relative h-48 bg-gradient-to-br from-blue-600 via-purple-700 to-blue-800 overflow-hidden">
              {/* Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -top-8 -right-8 w-32 h-32 border-4 border-white/30 rounded-full" />
                <div className="absolute -top-4 -right-4 w-20 h-20 border-4 border-white/20 rounded-full" />
                <div className="absolute bottom-0 left-0 w-full h-full" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                  backgroundSize: '30px 30px'
                }} />
              </div>

              {/* Info Section */}
              <div className="relative px-6 py-8 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-blue-100 text-xs mb-1">NID:</p>
                    <p className="text-white font-bold text-lg">{driverData.id}</p>
                  </div>
                </div>

                <div>
                  <p className="text-blue-100 text-xs mb-1">Email:</p>
                  <p className="text-white font-semibold text-sm">{driverData.email}</p>
                </div>

                <div>
                  <p className="text-blue-100 text-xs mb-1">Phone:</p>
                  <p className="text-white font-semibold text-sm">+212 600 000 000</p>
                </div>
              </div>
            </div>

            {/* Lost Card Info */}
            <div className="px-6 py-6 space-y-4 pb-32">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-700 dark:text-slate-300 mb-2 font-semibold">
                  If this card is found, please inform:
                </p>
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  <p>Lorem Ipsum, 026</p>
                  <p>25th Str. Dolor Amet</p>
                  <p>NY, USA</p>
                </div>
              </div>

              {/* Bottom Wave */}
              <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 400 120" className="w-full">
                  <path
                    d="M0,80 Q100,40 200,80 T400,80 L400,120 L0,120 Z"
                    fill="url(#backWaveGradient)"
                    opacity="0.9"
                  />
                  <defs>
                    <linearGradient id="backWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Company Name in Wave */}
                <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-2 z-10">
                  <Bus className="h-5 w-5 text-blue-900 dark:text-white drop-shadow-md" />
                  <span className="text-blue-900 dark:text-white font-bold text-sm tracking-wider drop-shadow-md">COMPANY NAME</span>
                </div>
                <div className="absolute bottom-4 left-0 right-0 text-center z-10">
                  <p className="text-blue-800 dark:text-white/90 text-xs drop-shadow-md">www.companyeb.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .perspective-\[1000px\] {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}

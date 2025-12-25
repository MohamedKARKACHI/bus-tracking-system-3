"use client"

import { useState, useEffect } from "react"
import { Shield, Building2, Award, Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import QRCode from "qrcode"

interface AdminIdCardProps {
    admin?: {
        id: string
        name: string
        email: string
        avatar?: string
        department?: string
        position?: string
        joinDate?: string
        accessLevel?: string
    }
}

export function AdminIdCard({ admin }: AdminIdCardProps) {
    const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
    const [isFlipped, setIsFlipped] = useState(false)

    // Use passed admin data directly without fallback
    const adminData = admin || {
        id: "ADM-2024-001",
        name: "Admin User",
        email: "admin@bustrack.com",
        avatar: undefined,
        department: "Operations",
        position: "Admin",
        joinDate: "Jan 2024",
        accessLevel: "Full Access",
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
        const qrData = `AID: ${adminData.id}\nEmail: ${adminData.email}\nPhone: +212 600 000 000`

        QRCode.toDataURL(qrData, {
            width: 180,
            margin: 2,
            color: {
                dark: "#0891b2",
                light: "#ffffff",
            },
        }).then(setQrCodeUrl)
    }, [adminData])

    return (
        <div className="w-full max-w-sm mx-auto perspective-[1000px]">
            <div
                className={cn(
                    "relative w-full aspect-[2/3] transition-transform duration-700 transform-style-3d cursor-pointer",
                    isFlipped && "rotate-y-180"
                )}
                onMouseEnter={() => setIsFlipped(true)}
                onMouseLeave={() => setIsFlipped(false)}
            >
                {/* Front of Card */}
                <div className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden shadow-2xl">
                    {/* Card Container */}
                    <div className="relative w-full h-full bg-white dark:bg-slate-900">
                        {/* Top Curved Section with Company Branding */}
                        <div className="relative h-36 bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 overflow-hidden">
                            {/* Geometric Pattern */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute top-4 right-4 w-24 h-24 border-4 border-white/30 rounded-full" />
                                <div className="absolute top-8 right-8 w-16 h-16 border-4 border-white/20 rounded-full" />
                                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-600/30 rounded-full blur-2xl" />
                                <div className="absolute top-0 right-0 w-full h-full" style={{
                                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                                    backgroundSize: '30px 30px'
                                }} />
                            </div>

                            {/* Company Logo and Name */}
                            <div className="relative px-6 pt-6 flex items-center gap-3">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl blur-md opacity-60" />
                                    <div className="relative h-12 w-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <Shield className="h-7 w-7 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-xl tracking-wide drop-shadow-lg">COMPANY NAME</h3>
                                    <p className="text-cyan-100 text-xs tracking-wider">ADMIN ID CARD</p>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="relative px-6 -mt-16 pb-24">
                            {/* Photo Section */}
                            <div className="flex justify-center mb-4">
                                <div className="relative">
                                    {/* Outer Glow */}
                                    <div className="absolute -inset-2 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 rounded-full blur-lg opacity-40" />

                                    {/* White Border */}
                                    <div className="relative bg-white dark:bg-slate-800 rounded-full p-2 shadow-2xl">
                                        {/* Photo Circle with Initials */}
                                        <div className="relative h-28 w-28 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center overflow-hidden">
                                            {adminData.avatar && adminData.avatar !== "/placeholder.svg" ? (
                                                <img
                                                    src={adminData.avatar}
                                                    alt={adminData.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-white text-4xl font-bold drop-shadow-lg">
                                                    {getInitials(adminData.name)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Name */}
                            <div className="text-center mb-4">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                    {adminData.name.toUpperCase()}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{adminData.position}</p>
                            </div>

                            {/* QR Code */}
                            <div className="flex justify-center mb-6">
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
                                    fill="url(#adminWaveGradient)"
                                    opacity="0.9"
                                />
                                <defs>
                                    <linearGradient id="adminWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#0891b2" />
                                        <stop offset="50%" stopColor="#06b6d4" />
                                        <stop offset="100%" stopColor="#3b82f6" />
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
                        <div className="relative h-48 bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 overflow-hidden">
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
                                        <p className="text-cyan-100 text-xs mb-1">AID:</p>
                                        <p className="text-white font-bold text-lg">{adminData.id}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-cyan-100 text-xs mb-1">Email:</p>
                                    <p className="text-white font-semibold text-sm">{adminData.email}</p>
                                </div>

                                <div>
                                    <p className="text-cyan-100 text-xs mb-1">Phone:</p>
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
                                        fill="url(#adminBackWaveGradient)"
                                        opacity="0.9"
                                    />
                                    <defs>
                                        <linearGradient id="adminBackWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#0891b2" />
                                            <stop offset="50%" stopColor="#06b6d4" />
                                            <stop offset="100%" stopColor="#3b82f6" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                {/* Company Name in Wave */}
                                <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-2 z-10">
                                    <Shield className="h-5 w-5 text-cyan-900 dark:text-white drop-shadow-md" />
                                    <span className="text-cyan-900 dark:text-white font-bold text-sm tracking-wider drop-shadow-md">COMPANY NAME</span>
                                </div>
                                <div className="absolute bottom-4 left-0 right-0 text-center z-10">
                                    <p className="text-cyan-800 dark:text-white/90 text-xs drop-shadow-md">www.companyeb.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        .perspective-[1000px] {
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

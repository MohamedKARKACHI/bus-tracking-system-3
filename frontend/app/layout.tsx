import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { AuthProvider } from "@/lib/auth-context"
import { GoogleOAuthProvider } from "@react-oauth/google"
import "./globals.css"
import "mapbox-gl/dist/mapbox-gl.css"
import "leaflet/dist/leaflet.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

// Updated metadata to match Bus Tracking System project
export const metadata: Metadata = {
  title: "BusTrack - Real-Time Fleet Management System",
  description:
    "Advanced bus tracking and management system with real-time monitoring, ANPR cameras, and comprehensive analytics",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Only enable Google OAuth if client ID is properly configured
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""
  const isGoogleOAuthEnabled = googleClientId && !googleClientId.includes('your_google_client_id_here')

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        {isGoogleOAuthEnabled ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            <AuthProvider>{children}</AuthProvider>
          </GoogleOAuthProvider>
        ) : (
          <AuthProvider>{children}</AuthProvider>
        )}
      </body>
    </html>
  )
}

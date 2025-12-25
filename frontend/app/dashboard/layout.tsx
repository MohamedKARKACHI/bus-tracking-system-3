"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.replace("/login")
            } else if (user.role !== "admin") {
                if (user.role === "driver") {
                    router.replace("/driver-portal")
                } else {
                    router.replace("/client-portal")
                }
            }
        }
    }, [user, isLoading, router])

    if (isLoading || !user || user.role !== "admin") {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">Checking Access...</p>
                </div>
            </div>
        )
    }

    return children
}

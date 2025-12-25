"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { CameraGrid } from "@/components/camera-grid"

export default function CamerasPage() {
    return (
        <DashboardShell>
            <div className="p-4 md:p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            ANPR Cameras
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Real-time feed status and detection logs
                        </p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                        Add Camera
                    </button>
                </div>

                <CameraGrid />
            </div>
        </DashboardShell>
    )
}

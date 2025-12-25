"use client"

import { Video, MapPin, CheckCircle2, AlertTriangle } from "lucide-react"
import { GlassCard } from "./ui/glass-card"

const cameras = [
  { id: "CAM-001", location: "Main Gate Entrance", status: "online", detections: 234, lastSeen: "2s ago" },
  { id: "CAM-002", location: "Central Terminal", status: "online", detections: 189, lastSeen: "5s ago" },
  { id: "CAM-003", location: "North Exit", status: "offline", detections: 0, lastSeen: "2h ago" },
  { id: "CAM-004", location: "South Parking", status: "online", detections: 156, lastSeen: "1s ago" },
  { id: "CAM-005", location: "East Terminal", status: "online", detections: 298, lastSeen: "3s ago" },
  { id: "CAM-006", location: "West Gate", status: "offline", detections: 0, lastSeen: "4h ago" },
]

export function CameraGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cameras.map((camera) => (
        <GlassCard key={camera.id} className="group hover:border-primary/30 transition-all">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`h-10 w-10 rounded-xl ${camera.status === "online" ? "bg-emerald-500/20" : "bg-amber-500/20"} flex items-center justify-center`}
              >
                <Video className={`h-5 w-5 ${camera.status === "online" ? "text-emerald-400" : "text-amber-400"}`} />
              </div>
              <span
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${
                  camera.status === "online" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                }`}
              >
                {camera.status === "online" ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <AlertTriangle className="h-3 w-3" />
                )}
                {camera.status}
              </span>
            </div>

            <h3 className="font-semibold text-primary dark:text-cyan-400 mb-1">{camera.id}</h3>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
              <MapPin className="h-3.5 w-3.5" />
              {camera.location}
            </div>

            <div className="flex items-center justify-between text-sm pt-3 border-t border-border/30">
              <span className="text-muted-foreground">Detections:</span>
              <span className="font-semibold text-foreground">{camera.detections}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-muted-foreground">Last seen:</span>
              <span className="font-semibold text-primary">{camera.lastSeen}</span>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}

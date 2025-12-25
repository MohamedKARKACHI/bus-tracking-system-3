"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { useDriverSidebar } from "@/lib/driver-sidebar-context"
import { useAuth } from "@/lib/auth-context"
import { AlertCircle, Clock, MapPin, CheckCircle2, XCircle, X, AlertTriangle, Shield, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { fetchWithAuth } from "@/lib/api-client"

export default function IncidentsPage() {
  const { sidebarExpanded } = useDriverSidebar()
  const { user } = useAuth()
  const [incidents, setIncidents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    type: "Traffic Delay",
    severity: "medium",
    location: "",
    description: ""
  })

  useEffect(() => {
    fetchIncidents()
  }, [])

  const fetchIncidents = async () => {
    try {
      const response = await fetchWithAuth('/api/incidents')

      if (response.ok) {
        const data = await response.json()
        setIncidents(data)
      } else {
      // Comprehensive fallback test data
      setIncidents([
        { id: 'INC-001', type: 'Traffic Delay', severity: 'medium', location: 'Main St & 5th Ave', description: 'Heavy traffic congestion causing 15min delay', time: '2 hours ago', status: 'resolved' },
        { id: 'INC-002', type: 'Vehicle Issue', severity: 'high', location: 'Downtown Terminal', description: 'Bus engine warning light activated', time: '4 hours ago', status: 'pending' },
        { id: 'INC-003', type: 'Passenger Complaint', severity: 'low', location: 'University Stop', description: 'Passenger reported AC malfunction', time: '1 day ago', status: 'resolved' },
        { id: 'INC-004', type: 'Road Closure', severity: 'high', location: 'Highway 101', description: 'Emergency road closure, route diversion required', time: '6 hours ago', status: 'pending' },
        { id: 'INC-005', type: 'Weather Alert', severity: 'medium', location: 'Coastal Route', description: 'Heavy rain affecting visibility, reduced speed necessary', time: '30 min ago', status: 'pending' },
        { id: 'INC-006', type: 'Medical Emergency', severity: 'high', location: 'Shopping District', description: 'Passenger required medical assistance, EMS contacted', time: '3 hours ago', status: 'resolved' },
        { id: 'INC-007', type: 'Mechanical Issue', severity: 'low', location: 'Airport Route', description: 'Door sensor malfunction on rear door', time: '5 hours ago', status: 'resolved' },
        { id: 'INC-008', type: 'Traffic Accident', severity: 'high', location: 'Business District', description: 'Multi-vehicle accident blocking main route', time: '1 hour ago', status: 'pending' },
      ])
    }
  } catch (error) {
    console.error('Failed to fetch incidents:', error)
    // Comprehensive fallback test data
    setIncidents([
      { id: 'INC-001', type: 'Traffic Delay', severity: 'medium', location: 'Main St & 5th Ave', description: 'Heavy traffic congestion causing 15min delay', time: '2 hours ago', status: 'resolved' },
      { id: 'INC-002', type: 'Vehicle Issue', severity: 'high', location: 'Downtown Terminal', description: 'Bus engine warning light activated', time: '4 hours ago', status: 'pending' },
      { id: 'INC-003', type: 'Passenger Complaint', severity: 'low', location: 'University Stop', description: 'Passenger reported AC malfunction', time: '1 day ago', status: 'resolved' },
      { id: 'INC-004', type: 'Road Closure', severity: 'high', location: 'Highway 101', description: 'Emergency road closure, route diversion required', time: '6 hours ago', status: 'pending' },
      { id: 'INC-005', type: 'Weather Alert', severity: 'medium', location: 'Coastal Route', description: 'Heavy rain affecting visibility, reduced speed necessary', time: '30 min ago', status: 'pending' },
      { id: 'INC-006', type: 'Medical Emergency', severity: 'high', location: 'Shopping District', description: 'Passenger required medical assistance, EMS contacted', time: '3 hours ago', status: 'resolved' },
      { id: 'INC-007', type: 'Mechanical Issue', severity: 'low', location: 'Airport Route', description: 'Door sensor malfunction on rear door', time: '5 hours ago', status: 'resolved' },
      { id: 'INC-008', type: 'Traffic Accident', severity: 'high', location: 'Business District', description: 'Multi-vehicle accident blocking main route', time: '1 hour ago', status: 'pending' },
    ])
  } finally {
    setLoading(false)
  }
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
    const response = await fetchWithAuth('/api/incidents', {
      method: 'POST',
      body: JSON.stringify(formData)
    })
    if (response.ok) {
      setShowModal(false)
      setFormData({ type: "Traffic Delay", severity: "medium", location: "", description: "" })
      fetchIncidents()
    }
  } catch (error) {
    console.error('Failed to report incident:', error)
  }
}

if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

return (
  <main
    className={cn(
      "flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto transition-all duration-300 bg-gradient-to-br from-background via-background to-muted/20",
      sidebarExpanded ? "lg:ml-0" : "lg:ml-0",
    )}
  >
    <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-1.5 sm:mb-2">Incident Reports</h1>
        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">Track and report incidents during your shifts</p>
      </div>
      <button
        onClick={() => setShowModal(true)}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm sm:text-base font-semibold hover:shadow-xl hover:scale-105 transition-all"
      >
        <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
        Report Incident
      </button>
    </div>

    {/* Stats Summary */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
      <GlassCard className="p-2.5 sm:p-3 lg:p-4 border-l-4 border-l-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground mb-1 leading-tight">Total Incidents</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{incidents.length}</p>
          </div>
          <div className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <AlertCircle className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-white" />
          </div>
        </div>
      </GlassCard>
      <GlassCard className="p-2.5 sm:p-3 lg:p-4 border-l-4 border-l-amber-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground mb-1 leading-tight">Pending</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{incidents.filter(i => i.status === 'pending').length}</p>
          </div>
          <div className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <Clock className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-white" />
          </div>
        </div>
      </GlassCard>
      <GlassCard className="p-2.5 sm:p-3 lg:p-4 border-l-4 border-l-emerald-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground mb-1 leading-tight">Resolved</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{incidents.filter(i => i.status === 'resolved').length}</p>
          </div>
          <div className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <CheckCircle2 className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-white" />
          </div>
        </div>
      </GlassCard>
      <GlassCard className="p-2.5 sm:p-3 lg:p-4 border-l-4 border-l-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground mb-1 leading-tight">This Week</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">12</p>
          </div>
          <div className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <FileText className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-white" />
          </div>
        </div>
      </GlassCard>
    </div>

    <div className="grid gap-4">
      {incidents.map((incident) => (
        <GlassCard key={incident.id} className="p-4 sm:p-6 border-2 border-primary/10 hover:border-primary/30 hover:shadow-xl transition-all">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
              <div
                className={cn(
                  "h-12 w-12 sm:h-14 sm:w-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg",
                  incident.severity === "high" && "bg-gradient-to-br from-red-500 to-red-600",
                  incident.severity === "medium" && "bg-gradient-to-br from-amber-500 to-orange-500",
                  incident.severity === "low" && "bg-gradient-to-br from-blue-500 to-cyan-500",
                )}
              >
                <AlertCircle className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-bold text-foreground">{incident.type}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{incident.id}</p>
                <div className={cn(
                  "inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold mt-2",
                  incident.severity === "high" && "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30",
                  incident.severity === "medium" && "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30",
                  incident.severity === "low" && "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30",
                )}>
                  <Shield className="h-3 w-3" />
                  {incident.severity.toUpperCase()} SEVERITY
                </div>
              </div>
            </div>
            <span
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md",
                incident.status === "resolved" && "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-500/30",
                incident.status === "pending" && "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-2 border-amber-500/30",
              )}
            >
              {incident.status === "resolved" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Clock className="h-4 w-4 animate-pulse" />
              )}
              {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
            </span>
          </div>

          <p className="text-sm sm:text-base text-foreground mb-4 p-3 bg-muted/50 rounded-lg">{incident.description}</p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-purple-500" />
              </div>
              <span className="font-medium">{incident.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-cyan-500" />
              </div>
              <span className="font-medium">{incident.time}</span>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>

    {/* Report Incident Modal */}
    {showModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <GlassCard className="w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Report Incident</h3>
            <button onClick={() => setShowModal(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-muted border border-border"
              >
                <option>Traffic Delay</option>
                <option>Vehicle Issue</option>
                <option>Passenger Complaint</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-muted border border-border"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter location"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-muted border border-border min-h-[100px]"
                placeholder="Describe the incident"
                required
              />
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Submit Report
              </Button>
            </div>
          </form>
        </GlassCard>
      </div>
    )}
  </main>
)
}

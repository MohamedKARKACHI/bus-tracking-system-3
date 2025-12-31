"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { useDriverSidebar } from "@/lib/driver-sidebar-context"
import { useAuth } from "@/lib/auth-context"
import {
  AlertCircle, Clock, MapPin, CheckCircle2, XCircle, X,
  AlertTriangle, Shield, FileText, Plus, Filter, Search,
  ChevronRight, TrendingUp, Zap, MessageSquare, Camera
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical'
type IncidentStatus = 'pending' | 'investigating' | 'resolved' | 'closed'

interface Incident {
  id: string
  type: string
  severity: IncidentSeverity
  location: string
  description: string
  time: string
  status: IncidentStatus
  route?: string
  reportedBy?: string
  resolvedAt?: string
  notes?: string
}

export default function IncidentsPage() {
  const { sidebarExpanded } = useDriverSidebar()
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState<IncidentStatus | 'all'>('all')
  const [formData, setFormData] = useState({
    type: "Traffic Delay",
    severity: "medium" as IncidentSeverity,
    location: "",
    description: ""
  })

  // Rich incidents data
  const incidents: Incident[] = [
    {
      id: 'INC-001',
      type: 'Traffic Delay',
      severity: 'medium',
      location: 'Avenue Mohammed V & Rue de la Liberté',
      description: 'Heavy traffic congestion causing 15 minute delay. Alternate route recommended via Boulevard Zerktouni.',
      time: '2 hours ago',
      status: 'resolved',
      route: 'Route A - Marrakech Express',
      reportedBy: 'Driver Ahmed',
      resolvedAt: '1 hour ago'
    },
    {
      id: 'INC-002',
      type: 'Vehicle Issue',
      severity: 'high',
      location: 'Gare Routière Central',
      description: 'Bus engine warning light activated. Vehicle moved to service bay for inspection.',
      time: '4 hours ago',
      status: 'investigating',
      route: 'Route B - Gueliz Line',
      reportedBy: 'Driver Karim'
    },
    {
      id: 'INC-003',
      type: 'Passenger Complaint',
      severity: 'low',
      location: 'Arrêt Université',
      description: 'Passenger reported AC malfunction in rear section. Temperature comfort issue.',
      time: '1 day ago',
      status: 'resolved',
      route: 'Route C - University Express',
      reportedBy: 'Passenger Feedback',
      resolvedAt: '12 hours ago',
      notes: 'AC unit serviced and restored to full function.'
    },
    {
      id: 'INC-004',
      type: 'Road Closure',
      severity: 'critical',
      location: 'Boulevard Al Yarmouk',
      description: 'Emergency road closure due to construction. All routes affected must use detour.',
      time: '6 hours ago',
      status: 'pending',
      route: 'Multiple Routes Affected'
    },
    {
      id: 'INC-005',
      type: 'Weather Alert',
      severity: 'medium',
      location: 'Coastal Route - Essaouira',
      description: 'Heavy rain and reduced visibility. Speed reduction advisory in effect.',
      time: '30 min ago',
      status: 'pending',
      route: 'Route E - Coastal Express'
    },
    {
      id: 'INC-006',
      type: 'Medical Emergency',
      severity: 'critical',
      location: 'Centre Commercial Marjane',
      description: 'Passenger required medical assistance. EMS contacted and patient transferred.',
      time: '3 hours ago',
      status: 'resolved',
      route: 'Route A - Marrakech Express',
      reportedBy: 'Driver Ahmed',
      resolvedAt: '2.5 hours ago',
      notes: 'Passenger stable. Bus resumed service after 25 min delay.'
    },
  ]

  const stats = {
    total: incidents.length,
    pending: incidents.filter(i => i.status === 'pending').length,
    investigating: incidents.filter(i => i.status === 'investigating').length,
    resolved: incidents.filter(i => i.status === 'resolved').length,
  }

  const filteredIncidents = filter === 'all'
    ? incidents
    : incidents.filter(i => i.status === filter)

  const getSeverityColor = (severity: IncidentSeverity) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
      case 'medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
      case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400'
      case 'critical': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
    }
  }

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>
      case 'investigating':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 flex items-center gap-1 animate-pulse"><Zap className="w-3 h-3" /> Investigating</span>
      case 'resolved':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Resolved</span>
      case 'closed':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400 flex items-center gap-1"><XCircle className="w-3 h-3" /> Closed</span>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Traffic Delay': return <Clock className="w-5 h-5" />
      case 'Vehicle Issue': return <AlertTriangle className="w-5 h-5" />
      case 'Passenger Complaint': return <MessageSquare className="w-5 h-5" />
      case 'Road Closure': return <XCircle className="w-5 h-5" />
      case 'Weather Alert': return <AlertCircle className="w-5 h-5" />
      case 'Medical Emergency': return <Shield className="w-5 h-5" />
      default: return <AlertCircle className="w-5 h-5" />
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Incident reported successfully!')
    setShowModal(false)
    setFormData({ type: "Traffic Delay", severity: "medium", location: "", description: "" })
  }

  return (
    <main className={cn(
      "flex-1 p-4 md:p-6 lg:p-8 pb-32 lg:pb-8 bg-gradient-to-br from-background via-background to-muted/20",
      sidebarExpanded ? "lg:ml-0" : "lg:ml-0",
    )}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
                Incident Reports
              </h1>
              <p className="text-sm text-muted-foreground">Track and manage incidents during your shifts</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-medium shadow-lg shadow-rose-500/30 hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Report Incident
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <GlassCard className="p-5 border-l-4 border-l-rose-500 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <TrendingUp className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-3xl font-bold text-foreground">{stats.total}</div>
          <p className="text-sm text-muted-foreground">Total Incidents</p>
        </GlassCard>

        <GlassCard className="p-5 border-l-4 border-l-amber-500 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            {stats.pending > 0 && <span className="flex h-3 w-3"><span className="animate-ping absolute h-3 w-3 rounded-full bg-amber-400 opacity-75"></span><span className="relative rounded-full h-3 w-3 bg-amber-500"></span></span>}
          </div>
          <div className="text-3xl font-bold text-foreground">{stats.pending}</div>
          <p className="text-sm text-muted-foreground">Pending</p>
        </GlassCard>

        <GlassCard className="p-5 border-l-4 border-l-blue-500 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">{stats.investigating}</div>
          <p className="text-sm text-muted-foreground">Investigating</p>
        </GlassCard>

        <GlassCard className="p-5 border-l-4 border-l-emerald-500 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">{stats.resolved}</div>
          <p className="text-sm text-muted-foreground">Resolved</p>
        </GlassCard>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {['all', 'pending', 'investigating', 'resolved', 'closed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={cn(
              "flex-shrink-0 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300",
              filter === status
                ? "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/30"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                {incidents.filter(i => i.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.map((incident) => (
          <GlassCard key={incident.id} className="p-5 hover:shadow-xl transition-all duration-300 group">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0",
                  incident.severity === 'critical' ? "bg-gradient-to-br from-red-500 to-rose-600" :
                    incident.severity === 'high' ? "bg-gradient-to-br from-orange-500 to-amber-600" :
                      incident.severity === 'medium' ? "bg-gradient-to-br from-amber-500 to-yellow-600" :
                        "bg-gradient-to-br from-blue-500 to-cyan-600"
                )}>
                  <span className="text-white">{getTypeIcon(incident.type)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold">{incident.type}</h3>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-bold uppercase", getSeverityColor(incident.severity))}>
                      {incident.severity}
                    </span>
                    {getStatusBadge(incident.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{incident.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {incident.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {incident.time}
                    </span>
                    {incident.route && (
                      <span className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        {incident.route}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">{incident.id}</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-rose-500 transition-colors" />
              </div>
            </div>

            {incident.status === 'resolved' && incident.notes && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Resolution Notes</p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-300">{incident.notes}</p>
                    {incident.resolvedAt && (
                      <p className="text-xs text-emerald-500 mt-1">Resolved {incident.resolvedAt}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        ))}
      </div>

      {/* Report Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-background rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-bold">Report New Incident</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Incident Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border bg-muted/50 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option>Traffic Delay</option>
                  <option>Vehicle Issue</option>
                  <option>Passenger Complaint</option>
                  <option>Road Closure</option>
                  <option>Weather Alert</option>
                  <option>Medical Emergency</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Severity</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['low', 'medium', 'high', 'critical'] as IncidentSeverity[]).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setFormData({ ...formData, severity: sev })}
                      className={cn(
                        "py-2 rounded-xl text-sm font-medium capitalize transition-all",
                        formData.severity === sev
                          ? getSeverityColor(sev)
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter the location"
                  className="w-full px-4 py-3 rounded-xl border bg-muted/50 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the incident..."
                  className="w-full px-4 py-3 rounded-xl border bg-muted/50 focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl font-medium bg-muted hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-rose-500 to-red-600 text-white hover:shadow-lg transition-all"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

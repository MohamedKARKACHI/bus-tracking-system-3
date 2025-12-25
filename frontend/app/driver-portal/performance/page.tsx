"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { useDriverSidebar } from "@/lib/driver-sidebar-context"
import { useAuth } from "@/lib/auth-context"
import { TrendingUp, Clock, Users, Star, Award, Target, Trophy, Zap, TrendingDown, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function PerformancePage() {
  const { sidebarExpanded } = useDriverSidebar()
  const { user } = useAuth()
  const [stats, setStats] = useState<any[]>([])
  const [achievements, setAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPerformanceData()
  }, [])

  const fetchPerformanceData = async () => {
    try {
      // Fetch performance stats with enhanced test data
      const statsData = [
        { label: "On-Time Rate", value: "94%", change: "+2.5%", trend: "up", icon: Clock, color: "emerald" },
        { label: "Total Trips", value: "342", change: "+18", trend: "up", icon: Target, color: "blue" },
        { label: "Passengers Served", value: "8,247", change: "+423", trend: "up", icon: Users, color: "cyan" },
        { label: "Passenger Rating", value: "4.8", change: "+0.2", trend: "up", icon: Star, color: "amber" },
        { label: "Fuel Efficiency", value: "8.2 km/L", change: "+0.4", trend: "up", icon: Zap, color: "purple" },
        { label: "Safety Score", value: "98%", change: "+1%", trend: "up", icon: Award, color: "rose" },
      ]
      setStats(statsData)

      // Fetch achievements with more data
      const achievementsData = [
        { id: 1, title: "Perfect Week", description: "100% on-time performance for 7 consecutive days", date: "Achieved 2 days ago", icon: Trophy, color: "emerald", completed: true },
        { id: 2, title: "Passenger Champion", description: "Served 1000+ passengers this month", date: "Achieved 5 days ago", icon: Users, color: "blue", completed: true },
        { id: 3, title: "Safe Driver", description: "30 days without incidents", date: "In progress - 23/30 days", icon: Award, color: "amber", completed: false, progress: 77 },
        { id: 4, title: "Eco Warrior", description: "Maintain fuel efficiency above 8.0 km/L", date: "Achieved 1 week ago", icon: Zap, color: "cyan", completed: true },
      ]
      setAchievements(achievementsData)
    } catch (error) {
      console.error('Failed to fetch performance data:', error)
    } finally {
      setLoading(false)
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
        "flex-1 p-3 sm:p-4 md:p-6 lg:p-8 pb-48 transition-all duration-300 bg-gradient-to-br from-background via-background to-muted/20",
        sidebarExpanded ? "lg:ml-0" : "lg:ml-0",
      )}
    >
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1.5 sm:mb-2">Performance Dashboard</h1>
        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">Track your metrics and achievements</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <GlassCard key={stat.label} className="p-2.5 sm:p-3 lg:p-4 hover:scale-105 transition-all duration-200 border-2 border-primary/10">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div
                  className={cn(
                    "h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0",
                    stat.color === "emerald" && "bg-gradient-to-br from-emerald-500 to-emerald-600",
                    stat.color === "blue" && "bg-gradient-to-br from-blue-500 to-blue-600",
                    stat.color === "cyan" && "bg-gradient-to-br from-cyan-500 to-cyan-600",
                    stat.color === "amber" && "bg-gradient-to-br from-amber-500 to-amber-600",
                    stat.color === "purple" && "bg-gradient-to-br from-purple-500 to-purple-600",
                    stat.color === "rose" && "bg-gradient-to-br from-rose-500 to-rose-600",
                  )}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold",
                    stat.trend === "up" && "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
                    stat.trend === "down" && "bg-red-500/20 text-red-600 dark:text-red-400"
                  )}
                >
                  {stat.trend === "up" ? <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-1">{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium leading-tight">{stat.label}</p>
            </GlassCard>
          )
        })}
      </div>

      <div>
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg flex-shrink-0">
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Achievements & Milestones</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon
            return (
              <GlassCard key={achievement.id} className="p-3 sm:p-4 lg:p-6 border-2 border-primary/10 hover:border-primary/30 hover:shadow-xl transition-all">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={cn(
                    "h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0",
                    achievement.color === "emerald" && "bg-gradient-to-br from-emerald-500 to-teal-500",
                    achievement.color === "blue" && "bg-gradient-to-br from-blue-500 to-cyan-500",
                    achievement.color === "amber" && "bg-gradient-to-br from-amber-500 to-orange-500",
                    achievement.color === "cyan" && "bg-gradient-to-br from-cyan-500 to-blue-500",
                  )}>
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1.5 sm:mb-2 gap-2">
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold text-foreground">{achievement.title}</h3>
                      {achievement.completed && (
                        <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-500/20 flex items-center justify-center border-2 border-emerald-500 flex-shrink-0">
                          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">{achievement.description}</p>
                    {!achievement.completed && achievement.progress && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-muted-foreground">Progress</span>
                          <span className="text-xs font-bold text-foreground">{achievement.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                            style={{ width: `${achievement.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {achievement.date}
                    </p>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>
      </div>
    </main>
  )
}

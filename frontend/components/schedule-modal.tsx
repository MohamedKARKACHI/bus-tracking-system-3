"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Calendar, Clock, MapPin, Bus } from "lucide-react"

interface ScheduleModalProps {
    isOpen: boolean
    onClose: () => void
    busName: string | undefined
}

export function ScheduleModal({ isOpen, onClose, busName }: ScheduleModalProps) {
    const schedule = [
        { stop: "Bab Doukkala", time: "08:00", status: "Departed" },
        { stop: "Gueliz Plaza", time: "08:15", status: "Departed" },
        { stop: "Ben Youssef", time: "08:30", status: "Current" },
        { stop: "Jemaa el Fna", time: "08:45", status: "Scheduled" },
        { stop: "Medina Gate", time: "09:00", status: "Scheduled" },
    ]

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                            <Bus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold">{busName || "Bus Schedule"}</DialogTitle>
                            <DialogDescription>Daily Route Timetable</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    {/* Timeline */}
                    <div className="space-y-6 relative">
                        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-800" />

                        {schedule.map((stop, i) => (
                            <div key={i} className="relative flex items-center gap-4 group">
                                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 ${stop.status === 'Current' ? 'border-indigo-100 dark:border-indigo-900 bg-indigo-500 text-white' : (stop.status === 'Departed' ? 'border-slate-100 dark:border-slate-800 bg-slate-200 dark:bg-slate-700 text-slate-500' : 'border-white dark:border-slate-900 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-400')}`}>
                                    {stop.status === 'Current' ? <Bus className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`font-bold ${stop.status === 'Current' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>{stop.stop}</span>
                                        <span className="text-xs font-mono font-medium text-slate-500">{stop.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`h-1.5 w-1.5 rounded-full ${stop.status === 'Current' ? 'bg-indigo-500 animate-pulse' : (stop.status === 'Departed' ? 'bg-slate-400' : 'bg-slate-300')}`} />
                                        <span className="text-xs text-slate-500">{stop.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

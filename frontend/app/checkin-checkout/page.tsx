"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import LicensePlateScanner from "@/components/license-plate-scanner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, ShieldCheck, ShieldAlert, Clock, Car, Filter } from "lucide-react";
import './scanner.css';

// Mock data for recent activity - in a real app this would come from an API
const recentActivity = [
    { id: 1, plate: "12345-A-1", type: "ENTRY", time: "10:42 AM", status: "authorized", location: "Main Gate" },
    { id: 2, plate: "98765-B-26", type: "EXIT", time: "10:38 AM", status: "authorized", location: "Main Gate" },
    { id: 3, plate: "45678-H-6", type: "ENTRY", time: "10:15 AM", status: "denied", location: "South Gate" },
    { id: 4, plate: "11223-A-1", type: "ENTRY", time: "09:55 AM", status: "authorized", location: "Main Gate" },
    { id: 5, plate: "99887-D-34", type: "EXIT", time: "09:40 AM", status: "authorized", location: "Main Gate" },
];

export default function CheckInCheckoutPage() {
    return (
        <DashboardShell>
            <div className="flex flex-col h-[calc(100vh-6rem)] gap-6 p-4 md:p-6 lg:p-8 max-w-[1920px] mx-auto">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Access Control</h1>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 px-3 py-1">
                                <span className="mr-2 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                System Online
                            </Badge>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Automated license plate recognition and gate management
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full min-h-0">
                    {/* Scanner Section - Takes up 2/3 width on large screens */}
                    <div className="xl:col-span-2 h-full flex flex-col min-h-0">
                        <LicensePlateScanner />
                    </div>

                    {/* Activity Feed Sidebar - Takes up 1/3 width */}
                    <div className="xl:col-span-1 h-full min-h-0 flex flex-col gap-6">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-100 dark:border-blue-900 shadow-sm">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Entries Today</p>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">142</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Car className="h-5 w-5" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-100 dark:border-purple-900 shadow-sm">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Alerts</p>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">3</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                        <ShieldAlert className="h-5 w-5" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Activity List */}
                        <Card className="flex-1 flex flex-col min-h-0 shadow-sm border-slate-200 dark:border-slate-800">
                            <CardHeader className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-slate-500" />
                                        Recent Activity
                                    </CardTitle>
                                    <button className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 transition-colors">
                                        <Filter className="h-3 w-3" /> Filter
                                    </button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 flex-1 min-h-0">
                                <ScrollArea className="h-full">
                                    <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
                                        {recentActivity.map((activity) => (
                                            <div key={activity.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between group">
                                                <div className="flex items-center gap-3">
                                                    <div className={`
                                                        h-10 w-10 rounded-full flex items-center justify-center border-2
                                                        ${activity.status === 'authorized'
                                                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400'
                                                            : 'bg-red-50 border-red-100 text-red-600 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400'}
                                                    `}>
                                                        {activity.status === 'authorized'
                                                            ? <ShieldCheck className="h-5 w-5" />
                                                            : <ShieldAlert className="h-5 w-5" />
                                                        }
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono font-bold text-slate-900 dark:text-white">{activity.plate}</span>
                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${activity.type === 'ENTRY' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400'}`}>
                                                                {activity.type}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                            <span>{activity.location}</span>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {activity.time}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                                                        Details
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}

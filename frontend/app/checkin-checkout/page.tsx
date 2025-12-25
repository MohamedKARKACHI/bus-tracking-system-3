"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import LicensePlateScanner from "@/components/license-plate-scanner";
import './scanner.css';

export default function CheckInCheckoutPage() {
    return (
        <DashboardShell>
            <div className="flex flex-col min-h-[calc(100vh-6rem)] p-4 md:p-6 gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Automated Check-in/Check-out</h1>
                    <p className="text-muted-foreground">
                        Manage gate access using AI-powered license plate recognition.
                    </p>
                </div>

                <div className="flex-1 flex justify-center">
                    <LicensePlateScanner />
                </div>
            </div>
        </DashboardShell>
    );
}

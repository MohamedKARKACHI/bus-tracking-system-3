"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { BusDataProvider } from "@/lib/bus-data-context"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider {...props}>
            <BusDataProvider>
                {children}
                <Toaster />
            </BusDataProvider>
        </NextThemesProvider>
    )
}

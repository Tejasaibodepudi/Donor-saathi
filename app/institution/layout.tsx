"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Building2, CalendarRange, Clock, Settings, Users } from "lucide-react"

const institutionNavItems = [
    { title: "Dashboard", href: "/institution/dashboard", icon: Building2 },
    { title: "Manage Drives", href: "/institution/drives", icon: CalendarRange },
    { title: "History", href: "/institution/history", icon: Clock },
    { title: "Settings", href: "/institution/settings", icon: Settings },
]

export default function InstitutionLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && (!user || user.role !== "institution")) {
            router.push("/login")
        }
    }, [user, isLoading, router])

    if (isLoading || !user) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        )
    }

    return (
        <SidebarProvider>
            <DashboardSidebar navItems={institutionNavItems} roleLabel="Institution" roleColor="bg-blue-600 text-white" />
            <SidebarInset className="bg-muted/50">{children}</SidebarInset>
        </SidebarProvider>
    )
}

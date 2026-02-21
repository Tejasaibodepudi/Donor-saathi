"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import {
  LayoutDashboard, User, Calendar, CalendarPlus, History, AlertTriangle,
} from "lucide-react"

const navItems = [
  { title: "Dashboard", href: "/donor", icon: LayoutDashboard },
  { title: "Profile", href: "/donor/profile", icon: User },
  { title: "Appointments", href: "/donor/appointments", icon: Calendar },
  { title: "Book Donation", href: "/donor/book", icon: CalendarPlus },
  { title: "History", href: "/donor/history", icon: History },
  { title: "Emergency Alerts", href: "/donor/emergency", icon: AlertTriangle },
]

export default function DonorLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "donor")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <SidebarProvider>
      <DashboardSidebar navItems={navItems} roleLabel="Donor" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}

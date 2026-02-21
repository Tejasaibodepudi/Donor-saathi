"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import {
  LayoutDashboard, CalendarDays, Calendar, ScanLine, Boxes, AlertTriangle,
} from "lucide-react"

const navItems = [
  { title: "Dashboard", href: "/blood-bank", icon: LayoutDashboard },
  { title: "Manage Slots", href: "/blood-bank/slots", icon: CalendarDays },
  { title: "Appointments", href: "/blood-bank/appointments", icon: Calendar },
  { title: "QR Scanner", href: "/blood-bank/scan", icon: ScanLine },
  { title: "Inventory", href: "/blood-bank/inventory", icon: Boxes },
  { title: "Emergency", href: "/blood-bank/emergency", icon: AlertTriangle },
]

export default function BloodBankLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "blood_bank")) {
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
      <DashboardSidebar navItems={navItems} roleLabel="Blood Bank" roleColor="bg-blue-600 text-white" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}

"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import {
  LayoutDashboard,
  Search,
  AlertTriangle,
  Package,
} from "lucide-react"

const navItems = [
  { title: "Overview", href: "/hospital", icon: LayoutDashboard },
  { title: "Search Blood", href: "/hospital/search", icon: Search },
  { title: "Emergency Requests", href: "/hospital/emergency", icon: AlertTriangle },
  { title: "Inventory Browser", href: "/hospital/inventory", icon: Package },
]

export default function HospitalLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "hospital")) {
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
      <DashboardSidebar navItems={navItems} roleLabel="Hospital" roleColor="bg-emerald-600 text-white" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}

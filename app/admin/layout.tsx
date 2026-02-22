"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
import { FEATURE_FLAGS } from "@/lib/features"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import {
  LayoutDashboard,
  Users,
  Building2,
  AlertTriangle,
  BarChart3,
} from "lucide-react"

const adminNav = [
  { title: "Overview", href: "/admin", icon: LayoutDashboard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Blood Banks", href: "/admin/blood-banks", icon: Building2 },
  { title: "Emergencies", href: "/admin/emergencies", icon: AlertTriangle },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const navItems = useMemo(() => {
    if (FEATURE_FLAGS.RARE_DONOR_REGISTRY) {
      return [...adminNav, { title: "Rare Donors", href: "/admin/rare-donors", icon: Users }]
    }
    return adminNav
  }, [])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
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
      <DashboardSidebar navItems={navItems} roleLabel="Admin" roleColor="bg-amber-600 text-white" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}

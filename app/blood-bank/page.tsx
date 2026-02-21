"use client"

import useSWR from "swr"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatCard } from "@/components/stat-card"
import { InventoryGrid } from "@/components/inventory-grid"
import { AppointmentCard } from "@/components/appointment-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Boxes, Calendar, Users, AlertTriangle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import type { InventoryItem } from "@/lib/data/types"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function BloodBankDashboard() {
  const { user } = useAuth()
  const { data: inv } = useSWR<InventoryItem[]>(user ? `/api/blood-banks/inventory?bloodBankId=${user.id}` : null, fetcher)
  const { data: appointments } = useSWR("/api/appointments", fetcher)
  const { data: emergencies } = useSWR("/api/emergency?status=active", fetcher)

  const totalUnits = inv?.reduce((s, i) => s + i.units, 0) || 0
  const lowStock = inv?.filter(i => i.units <= 5).length || 0
  const todayApts = appointments?.filter((a: { status: string }) => a.status === "booked" || a.status === "checked_in") || []

  return (
    <>
      <DashboardHeader title="Blood Bank Dashboard" subtitle="Manage inventory and appointments" />
      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Blood Units" value={totalUnits} icon={Boxes} subtitle="across all groups" />
          <StatCard title="Low Stock Alerts" value={lowStock} icon={AlertTriangle} subtitle="groups below 5 units" />
          <StatCard title="Today's Bookings" value={todayApts.length} icon={Calendar} subtitle="pending check-in" />
          <StatCard title="Active Emergencies" value={emergencies?.length || 0} icon={Users} subtitle="requests active" />
        </div>

        {/* Inventory Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inventory Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {inv ? <InventoryGrid items={inv} /> : <p className="text-sm text-muted-foreground">Loading...</p>}
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayApts.length > 0 ? (
              todayApts.slice(0, 5).map((apt: { id: string; status: string; qrCode: string; slotDate: string; slotTime: string; donorName: string; donorBloodGroup: string }) => (
                <AppointmentCard key={apt.id} appointment={apt} showDonor />
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No upcoming appointments</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

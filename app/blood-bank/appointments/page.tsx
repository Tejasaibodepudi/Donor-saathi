"use client"

import useSWR from "swr"
import { DashboardHeader } from "@/components/dashboard-header"
import { AppointmentCard } from "@/components/appointment-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DonorMetricsBadge } from "@/frontend/components/donor-metrics-badge"
import { toast } from "sonner"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function BloodBankAppointments() {
  const { data: appointments, mutate } = useSWR("/api/appointments", fetcher, { refreshInterval: 5000 })

  const handleAction = async (id: string, action: string) => {
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    })
    if (res.ok) {
      toast.success(`Appointment ${action === "check_in" ? "checked in" : action}`)
      mutate()
    } else {
      toast.error("Action failed")
    }
  }

  const booked = appointments?.filter((a: { status: string }) => a.status === "booked") || []
  const checkedIn = appointments?.filter((a: { status: string }) => a.status === "checked_in") || []
  const completed = appointments?.filter((a: { status: string }) => a.status === "completed") || []

  return (
    <>
      <DashboardHeader title="Appointments" subtitle="Manage donor appointments" />
      <div className="flex-1 p-6">
        <Tabs defaultValue="booked">
          <TabsList>
            <TabsTrigger value="booked">Booked ({booked.length})</TabsTrigger>
            <TabsTrigger value="checked_in">Checked In ({checkedIn.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="booked" className="mt-4 space-y-3">
            {booked.length > 0 ? (
              booked.map((apt: { id: string; status: string; qrCode: string; slotDate: string; slotTime: string; donorName: string; donorBloodGroup: string; donorTrustScore: number }) => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  showDonor
                  showMetrics
                  actions={
                    <Button size="sm" onClick={() => handleAction(apt.id, "check_in")}>
                      Check In
                    </Button>
                  }
                />
              ))
            ) : (
              <div className="rounded-lg border p-8 text-center">
                <p className="text-sm text-muted-foreground">No booked appointments</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="checked_in" className="mt-4 space-y-3">
            {checkedIn.length > 0 ? (
              checkedIn.map((apt: { id: string; status: string; qrCode: string; slotDate: string; slotTime: string; donorName: string; donorBloodGroup: string; donorTrustScore: number }) => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  showDonor
                  showMetrics
                  actions={
                    <Button size="sm" onClick={() => handleAction(apt.id, "complete")}>
                      Mark Complete
                    </Button>
                  }
                />
              ))
            ) : (
              <div className="rounded-lg border p-8 text-center">
                <p className="text-sm text-muted-foreground">No checked-in donors</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="completed" className="mt-4 space-y-3">
            {completed.length > 0 ? (
              completed.map((apt: { id: string; status: string; qrCode: string; slotDate: string; slotTime: string; donorName: string; donorBloodGroup: string; donorTrustScore: number }) => (
                <AppointmentCard key={apt.id} appointment={apt} showDonor showMetrics />
              ))
            ) : (
              <div className="rounded-lg border p-8 text-center">
                <p className="text-sm text-muted-foreground">No completed appointments</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

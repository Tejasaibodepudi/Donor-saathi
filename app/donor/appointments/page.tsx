"use client"

import useSWR from "swr"
import { DashboardHeader } from "@/components/dashboard-header"
import { AppointmentCard } from "@/components/appointment-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { toast } from "sonner"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function DonorAppointments() {
  const { data: appointments, mutate } = useSWR("/api/appointments", fetcher)

  const cancelAppointment = async (id: string) => {
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    })
    if (res.ok) {
      toast.success("Appointment cancelled")
      mutate()
    } else {
      toast.error("Failed to cancel")
    }
  }

  const upcoming = appointments?.filter((a: { status: string }) => a.status === "booked" || a.status === "checked_in") || []
  const past = appointments?.filter((a: { status: string }) => a.status === "completed" || a.status === "cancelled") || []

  return (
    <>
      <DashboardHeader title="Appointments" subtitle="View and manage your donation appointments" />
      <div className="flex-1 p-6">
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="mt-4 space-y-3">
            {upcoming.length > 0 ? (
              upcoming.map((apt: { id: string; status: string; qrCode: string; slotDate: string; slotTime: string; bloodBankName: string }) => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  actions={
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/donor/qr/${apt.id}`}>QR Code</Link>
                      </Button>
                      {apt.status === "booked" && (
                        <Button variant="destructive" size="sm" onClick={() => cancelAppointment(apt.id)}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  }
                />
              ))
            ) : (
              <div className="rounded-lg border p-8 text-center">
                <p className="text-sm text-muted-foreground mb-3">No upcoming appointments</p>
                <Button asChild>
                  <Link href="/donor/book">Book a Donation</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="past" className="mt-4 space-y-3">
            {past.length > 0 ? (
              past.map((apt: { id: string; status: string; qrCode: string; slotDate: string; slotTime: string; bloodBankName: string }) => (
                <AppointmentCard key={apt.id} appointment={apt} />
              ))
            ) : (
              <div className="rounded-lg border p-8 text-center">
                <p className="text-sm text-muted-foreground">No past appointments</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

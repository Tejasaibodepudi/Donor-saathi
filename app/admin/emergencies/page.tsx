"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { EmergencyAlertCard } from "@/components/emergency-alert-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { EmergencyRequest } from "@/lib/data/types"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function AdminEmergenciesPage() {
  const { data: emergencies, mutate } = useSWR<EmergencyRequest[]>("/api/emergency", fetcher)

  const active = emergencies?.filter((e) => e.status === "active") || []
  const resolved = emergencies?.filter((e) => e.status !== "active") || []

  async function resolveEmergency(id: string) {
    try {
      const res = await fetch(`/api/emergency/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "fulfilled" }),
      })
      if (!res.ok) throw new Error("Failed")
      toast.success("Emergency marked as fulfilled.")
      mutate()
    } catch {
      toast.error("Failed to update emergency.")
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader title="Emergency Management" subtitle="Monitor and manage all emergency blood requests" />
      <div className="flex-1 p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Active Emergencies ({active.length})</CardTitle>
              <CardDescription>Requests currently awaiting fulfillment</CardDescription>
            </CardHeader>
            <CardContent>
              {active.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active emergencies.</p>
              ) : (
                <div className="space-y-3">
                  {active.map((e) => (
                    <div key={e.id} className="space-y-2">
                      <EmergencyAlertCard emergency={e} />
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => resolveEmergency(e.id)}
                      >
                        Mark as Fulfilled
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resolved Emergencies ({resolved.length})</CardTitle>
              <CardDescription>Previously resolved or expired requests</CardDescription>
            </CardHeader>
            <CardContent>
              {resolved.length === 0 ? (
                <p className="text-sm text-muted-foreground">No resolved emergencies yet.</p>
              ) : (
                <div className="space-y-3">
                  {resolved.map((e) => (
                    <EmergencyAlertCard key={e.id} emergency={e} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

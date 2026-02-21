"use client"

import useSWR from "swr"
import { DashboardHeader } from "@/components/dashboard-header"
import { EmergencyAlertCard } from "@/components/emergency-alert-card"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import type { EmergencyRequest } from "@/lib/data/types"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function DonorEmergency() {
  const { user } = useAuth()
  const { data: donors } = useSWR("/api/donors", fetcher)
  const { data: emergencies } = useSWR<EmergencyRequest[]>("/api/emergency?status=active", fetcher)

  const donor = donors?.find((d: { email: string }) => d.email === user?.email)

  // Show all emergencies but highlight matching blood type
  const matching = emergencies?.filter(e => e.bloodGroup === donor?.bloodGroup) || []
  const other = emergencies?.filter(e => e.bloodGroup !== donor?.bloodGroup) || []

  return (
    <>
      <DashboardHeader title="Emergency Alerts" subtitle="Active emergency blood requests" />
      <div className="flex-1 space-y-6 p-6">
        {matching.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-medium">Matching Your Blood Type ({donor?.bloodGroup})</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {matching.map(e => (
                <EmergencyAlertCard key={e.id} emergency={e} />
              ))}
            </div>
          </div>
        )}

        {other.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Other Emergency Requests</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {other.map(e => (
                <EmergencyAlertCard key={e.id} emergency={e} />
              ))}
            </div>
          </div>
        )}

        {(!emergencies || emergencies.length === 0) && (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No active emergency requests at this time</p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}

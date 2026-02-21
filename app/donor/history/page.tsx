"use client"

import useSWR from "swr"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatCard } from "@/components/stat-card"
import { AppointmentCard } from "@/components/appointment-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, Shield, TrendingUp, Calendar } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function DonorHistory() {
  const { user } = useAuth()
  const { data: donors } = useSWR("/api/donors", fetcher)
  const { data: appointments } = useSWR("/api/appointments", fetcher)

  const donor = donors?.find((d: { email: string }) => d.email === user?.email)
  const completed = appointments?.filter((a: { status: string }) => a.status === "completed") || []

  return (
    <>
      <DashboardHeader title="Donation History" subtitle="Your donation record and trust score" />
      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Donations" value={donor?.totalDonations || 0} icon={Droplets} />
          <StatCard title="Trust Score" value={`${donor?.trustScore || 0}/100`} icon={Shield} />
          <StatCard title="Last Donation" value={donor?.lastDonation ? new Date(donor.lastDonation).toLocaleDateString() : "N/A"} icon={Calendar} />
          <StatCard title="Status" value={donor?.isAvailable ? "Available" : "Unavailable"} icon={TrendingUp} />
        </div>

        {/* Trust Score Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Trust Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "Donations completed", points: "+2 per donation", earned: (donor?.totalDonations || 0) * 2 },
                { label: "Base score", points: "Starting score", earned: 50 },
                { label: "On-time check-ins", points: "+1 per on-time", earned: Math.min(10, (donor?.totalDonations || 0)) },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2.5">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.points}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">+{item.earned}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Completed Donations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Completed Donations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completed.length > 0 ? (
              completed.map((apt: { id: string; status: string; qrCode: string; slotDate: string; slotTime: string; bloodBankName: string }) => (
                <AppointmentCard key={apt.id} appointment={apt} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No completed donations yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

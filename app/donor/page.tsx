"use client"

import useSWR from "swr"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatCard } from "@/components/stat-card"
import { AppointmentCard } from "@/components/appointment-card"
import { EmergencyAlertCard } from "@/components/emergency-alert-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Calendar, Droplets, Heart, Shield, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { RareDonorCard } from "@/frontend/components/rare-donor-card"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { FEATURE_FLAGS } from "@/lib/features"
import type { EmergencyRequest } from "@/lib/data/types"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function DonorDashboard() {
  const { user } = useAuth()
  const { data: donors, mutate: mutateDonors } = useSWR("/api/donors", fetcher)
  const { data: appointments } = useSWR("/api/appointments", fetcher)
  const { data: emergencies } = useSWR("/api/emergency?status=active", fetcher)

  const donor = donors?.find((d: { email: string }) => d.email === user?.email)
  const upcomingApts = appointments?.filter((a: { status: string }) => a.status === "booked" || a.status === "checked_in") || []

  // Calculate donation eligibility (90 days cooldown)
  const calculateEligibility = () => {
    if (!donor?.lastDonation) {
      return { eligible: true, daysRemaining: 0, message: "Eligible to donate" }
    }
    const lastDonationDate = new Date(donor.lastDonation)
    const daysSinceLastDonation = Math.floor((Date.now() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24))
    const daysRemaining = Math.max(0, 90 - daysSinceLastDonation)
    
    return {
      eligible: daysRemaining === 0,
      daysRemaining,
      daysSince: daysSinceLastDonation,
      message: daysRemaining > 0 
        ? `Wait ${daysRemaining} more days` 
        : "Eligible to donate"
    }
  }

  const eligibility = calculateEligibility()

  const toggleAvailability = async () => {
    const res = await fetch("/api/donors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !donor?.isAvailable }),
    })
    if (res.ok) {
      toast.success(donor?.isAvailable ? "Marked as unavailable" : "Marked as available")
      mutateDonors()
    }
  }

  // Filter emergencies matching donor blood type
  const matchingEmergencies = emergencies?.filter((e: { bloodGroup: string }) =>
    e.bloodGroup === donor?.bloodGroup || e.bloodGroup === "O-"
  )?.slice(0, 2) || []

  return (
    <>
      <DashboardHeader title="Donor Dashboard" subtitle="Manage your donations and appointments" />
      <div className="flex-1 space-y-6 p-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Donations"
            value={donor?.totalDonations || 0}
            icon={Droplets}
            subtitle="lifetime donations"
          />
          <StatCard
            title="Trust Score"
            value={`${donor?.trustScore || 0}/100`}
            icon={Shield}
            subtitle="donor reliability"
          />
          <StatCard
            title="Upcoming"
            value={upcomingApts.length}
            icon={Calendar}
            subtitle="appointments booked"
          />
          <StatCard
            title="Blood Group"
            value={donor?.bloodGroup || "N/A"}
            icon={Heart}
          />
          <StatCard
            title="Donation Status"
            value={eligibility.eligible ? "Eligible" : "Not Eligible"}
            icon={AlertTriangle}
            subtitle={eligibility.message}
            variant={eligibility.eligible ? "default" : "destructive"}
          />
        </div>

        {/* Availability Toggle + Quick Actions */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="font-medium">Donation Availability</p>
                <p className="text-sm text-muted-foreground">
                  {donor?.isAvailable ? "You are available for donations" : "You are currently unavailable"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={donor?.isAvailable ? "default" : "secondary"}>
                  {donor?.isAvailable ? "Available" : "Unavailable"}
                </Badge>
                <Switch checked={donor?.isAvailable || false} onCheckedChange={toggleAvailability} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <Button asChild className="flex-1" disabled={!eligibility.eligible}>
                <Link href="/donor/book">
                  {eligibility.eligible ? "Book Donation" : `Wait ${eligibility.daysRemaining} days`}
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/donor/appointments">View Appointments</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingApts.length > 0 ? (
                upcomingApts.slice(0, 3).map((apt: { id: string; status: string; qrCode: string; slotDate: string; slotTime: string; bloodBankName: string }) => (
                  <AppointmentCard key={apt.id} appointment={apt} actions={
                    apt.status === "booked" && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/donor/qr/${apt.id}`}>View QR Code</Link>
                      </Button>
                    )
                  } />
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">No upcoming appointments</p>
              )}
            </CardContent>
          </Card>

          {/* Emergency Alerts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-primary" />
                Emergency Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {matchingEmergencies.length > 0 ? (
                matchingEmergencies.map((emrg: EmergencyRequest) => (
                  <EmergencyAlertCard key={emrg.id} emergency={emrg} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">No matching emergency alerts</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Rare Donor Program (Feature Flagged) */}
        {FEATURE_FLAGS.RARE_DONOR_REGISTRY && (
          <div className="mt-6">
            <RareDonorCard />
          </div>
        )}
      </div>
    </>
  )
}

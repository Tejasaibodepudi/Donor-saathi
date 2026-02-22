"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { StatCard } from "@/components/stat-card"
import { EmergencyAlertCard } from "@/components/emergency-alert-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, AlertTriangle, Package, Activity } from "lucide-react"
import Link from "next/link"
import { FEATURE_FLAGS } from "@/lib/features"
import { RareBloodNetworkCard } from "@/frontend/components/rare-blood-network-card"
import type { EmergencyRequest } from "@/lib/data/types"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function HospitalDashboard() {
  const { data: emergencies } = useSWR<EmergencyRequest[]>("/api/emergency", fetcher)
  const { data: banks } = useSWR("/api/blood-banks", fetcher)

  const activeEmergencies = emergencies?.filter((e) => e.status === "active") || []
  const totalBanks = banks?.length || 0

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader title="Hospital Dashboard" subtitle="Blood supply overview and emergency management" />
      <div className="flex-1 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Blood Banks"
            value={totalBanks}
            icon={Package}
            description="Available in network"
          />
          <StatCard
            title="Active Emergencies"
            value={activeEmergencies.length}
            icon={AlertTriangle}
            description="Pending requests"
            variant="destructive"
          />
          <StatCard
            title="Network Status"
            value="Online"
            icon={Activity}
            description="All systems operational"
          />
          <StatCard
            title="Quick Search"
            value="Find Blood"
            icon={Search}
            description="Search available units"
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common hospital operations</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/hospital/search">
                  <Search className="mr-2 h-4 w-4" />
                  Search Available Blood Units
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="destructive">
                <Link href="/hospital/emergency">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Create Emergency Request
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/hospital/inventory">
                  <Package className="mr-2 h-4 w-4" />
                  Browse Blood Bank Inventory
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Emergencies</CardTitle>
              <CardDescription>Emergency blood requests</CardDescription>
            </CardHeader>
            <CardContent>
              {activeEmergencies.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active emergency requests.</p>
              ) : (
                <div className="space-y-3">
                  {activeEmergencies.slice(0, 3).map((e) => (
                    <EmergencyAlertCard key={e.id} emergency={e} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Rare Blood Network (Feature Flagged) */}
        {FEATURE_FLAGS.RARE_DONOR_REGISTRY && (
          <div className="mt-6">
            <RareBloodNetworkCard />
          </div>
        )}
      </div>
    </div>
  )
}

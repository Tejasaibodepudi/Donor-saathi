"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { InventoryGrid } from "@/components/inventory-grid"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(r => r.json())

interface BloodBank {
  id: string
  name: string
  address: string
  phone: string
  verified: boolean
  inventory: Record<string, number>
}

export default function HospitalInventoryPage() {
  const { data: banks } = useSWR<BloodBank[]>("/api/blood-banks", fetcher)

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader title="Inventory Browser" subtitle="View blood bank inventory levels across the network" />
      <div className="flex-1 p-6">
        <div className="space-y-6">
          {banks?.map((bank) => (
            <Card key={bank.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{bank.name}</CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {bank.address}
                    </CardDescription>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {bank.phone}
                    </p>
                  </div>
                  {bank.verified && (
                    <Badge variant="secondary" className="bg-success/10 text-success">Verified</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {bank.inventory && Object.keys(bank.inventory).length > 0 ? (
                  <InventoryGrid
                    items={Object.entries(bank.inventory).map(([group, units], i) => ({
                      id: `${bank.id}-${group}`,
                      bloodBankId: bank.id,
                      bloodGroup: group as import("@/lib/data/types").BloodGroup,
                      units: units as number,
                      lastUpdated: new Date().toISOString(),
                    }))}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No inventory data</p>
                )}
              </CardContent>
            </Card>
          ))}
          {(!banks || banks.length === 0) && (
            <div className="py-12 text-center text-muted-foreground">
              No blood banks found in the network.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

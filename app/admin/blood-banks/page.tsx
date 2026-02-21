"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { InventoryGrid } from "@/components/inventory-grid"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
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

export default function AdminBloodBanksPage() {
  const { data: banks, mutate } = useSWR<BloodBank[]>("/api/blood-banks", fetcher)

  async function toggleVerify(bankId: string, verified: boolean) {
    try {
      const res = await fetch(`/api/blood-banks/${bankId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: !verified }),
      })
      if (!res.ok) throw new Error("Failed")
      toast.success(verified ? "Blood bank unverified." : "Blood bank verified.")
      mutate()
    } catch {
      toast.error("Failed to update blood bank.")
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader title="Blood Banks" subtitle="Manage and verify blood banks in the network" />
      <div className="flex-1 p-6">
        <div className="space-y-4">
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
                  <div className="flex items-center gap-2">
                    {bank.verified ? (
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-warning/10 text-warning-foreground">
                        <XCircle className="mr-1 h-3 w-3" />
                        Unverified
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant={bank.verified ? "outline" : "default"}
                      onClick={() => toggleVerify(bank.id, bank.verified)}
                    >
                      {bank.verified ? "Unverify" : "Verify"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {bank.inventory && Object.keys(bank.inventory).length > 0 ? (
                  <InventoryGrid
                    items={Object.entries(bank.inventory).map(([group, units]) => ({
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
              No blood banks registered yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import useSWR from "swr"
import { DashboardHeader } from "@/components/dashboard-header"
import { InventoryGrid } from "@/components/inventory-grid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Boxes } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import type { InventoryItem } from "@/lib/data/types"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function BloodBankInventory() {
  const { user } = useAuth()
  const { data: inv, mutate } = useSWR<InventoryItem[]>(
    user ? `/api/blood-banks/inventory?bloodBankId=${user.id}` : null,
    fetcher
  )

  const handleAdjust = async (bloodGroup: string, units: number) => {
    const res = await fetch("/api/blood-banks/inventory", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bloodGroup, units }),
    })
    if (res.ok) {
      toast.success(`${bloodGroup} updated to ${units} units`)
      mutate()
    }
  }

  const totalUnits = inv?.reduce((s, i) => s + i.units, 0) || 0

  return (
    <>
      <DashboardHeader title="Inventory Management" subtitle="Manage blood unit inventory" />
      <div className="flex-1 p-6 space-y-6">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-primary/10 p-3">
              <Boxes className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalUnits}</p>
              <p className="text-sm text-muted-foreground">total blood units in stock</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Blood Units by Group</CardTitle>
            <p className="text-sm text-muted-foreground">Use +/- buttons to adjust inventory manually</p>
          </CardHeader>
          <CardContent>
            {inv ? (
              <InventoryGrid items={inv} editable onAdjust={handleAdjust} />
            ) : (
              <p className="text-sm text-muted-foreground">Loading inventory...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

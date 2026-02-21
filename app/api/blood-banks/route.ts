import { NextResponse } from "next/server"
import { bloodBanks, inventory } from "@/lib/data/store"

export async function GET() {
  const all = Array.from(bloodBanks.values()).map(({ password: _, ...b }) => {
    // Attach inventory summary for this blood bank
    const bankInventory: Record<string, number> = {}
    Array.from(inventory.values())
      .filter(inv => inv.bloodBankId === b.id)
      .forEach(inv => {
        bankInventory[inv.bloodGroup] = inv.units
      })
    return {
      ...b,
      verified: b.status === "verified",
      inventory: bankInventory,
    }
  })
  return NextResponse.json(all)
}

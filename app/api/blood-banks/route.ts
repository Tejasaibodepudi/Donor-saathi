import { NextResponse } from "next/server"
import dbConnect from "@/database/db"
import { BloodBank, InventoryItem } from "@/database/models"

export async function GET() {
  await dbConnect()
  const banks = await BloodBank.find({}).select("-password -_id").lean() as any[]
  const items = await InventoryItem.find({}).lean() as any[]

  const all = banks.map(b => {
    const bankInventory: Record<string, number> = {}
    items.filter(inv => inv.bloodBankId === b.id).forEach(inv => {
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

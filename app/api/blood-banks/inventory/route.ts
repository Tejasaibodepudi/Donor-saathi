import { NextResponse } from "next/server"
import { inventory } from "@/lib/data/store"
import { getAuthToken } from "@/lib/auth"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const bloodBankId = searchParams.get("bloodBankId")

  let items = Array.from(inventory.values())
  if (bloodBankId) items = items.filter(i => i.bloodBankId === bloodBankId)

  return NextResponse.json(items)
}

export async function PATCH(req: Request) {
  const payload = await getAuthToken()
  if (!payload || payload.role !== "blood_bank") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { bloodGroup, units } = await req.json()
  const item = Array.from(inventory.values()).find(
    i => i.bloodBankId === payload.id && i.bloodGroup === bloodGroup
  )

  if (!item) {
    return NextResponse.json({ error: "Inventory item not found" }, { status: 404 })
  }

  item.units = Math.max(0, units)
  item.lastUpdated = new Date().toISOString()
  inventory.set(item.id, item)

  return NextResponse.json(item)
}

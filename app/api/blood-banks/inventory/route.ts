import { NextResponse } from "next/server"
import dbConnect from "@/database/db"
import { InventoryItem } from "@/database/models"
import { getAuthToken } from "@/lib/auth"

function generateId(): string {
  return `id_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`
}

export async function GET(req: Request) {
  await dbConnect()
  const { searchParams } = new URL(req.url)
  const bloodBankId = searchParams.get("bloodBankId")

  const query: any = {}
  if (bloodBankId) query.bloodBankId = bloodBankId

  const items = await InventoryItem.find(query).lean()
  return NextResponse.json(items)
}

export async function PATCH(req: Request) {
  await dbConnect()
  const payload = await getAuthToken()
  if (!payload || payload.role !== "blood_bank") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { bloodGroup, units } = await req.json()

  let item = await InventoryItem.findOne({
    bloodBankId: payload.id,
    bloodGroup
  })

  if (!item) {
    // Upsert if a new blood bank doesn't have initialized rows
    item = new InventoryItem({
      id: generateId(),
      bloodBankId: payload.id,
      bloodGroup,
      units: Math.max(0, units),
      lastUpdated: new Date().toISOString()
    })
  } else {
    item.units = Math.max(0, units)
    item.lastUpdated = new Date().toISOString()
  }

  await item.save()

  const safe = item.toObject() as any
  delete safe._id
  return NextResponse.json(safe)
}

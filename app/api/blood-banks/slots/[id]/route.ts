import { NextResponse } from "next/server"
import { donationSlots } from "@/lib/data/store"
import { getAuthToken } from "@/lib/auth"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getAuthToken()
  if (!payload || payload.role !== "blood_bank") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const slot = donationSlots.get(id)
  if (!slot || slot.bloodBankId !== payload.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const updates = await req.json()
  if (updates.capacity !== undefined) slot.capacity = updates.capacity
  if (updates.isActive !== undefined) slot.isActive = updates.isActive
  if (updates.startTime) slot.startTime = updates.startTime
  if (updates.endTime) slot.endTime = updates.endTime

  donationSlots.set(id, slot)
  return NextResponse.json(slot)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getAuthToken()
  if (!payload || payload.role !== "blood_bank") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const slot = donationSlots.get(id)
  if (!slot || slot.bloodBankId !== payload.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  donationSlots.delete(id)
  return NextResponse.json({ success: true })
}

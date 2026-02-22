import { NextResponse } from "next/server"
import dbConnect from "@/database/db"
import { DonationSlot, Appointment } from "@/database/models"
import { getAuthToken } from "@/lib/auth"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect()
  const payload = await getAuthToken()
  if (!payload || payload.role !== "blood_bank") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const slot = await DonationSlot.findOne({ id })
  if (!slot || slot.bloodBankId !== payload.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const updates = await req.json()
  if (updates.capacity !== undefined) slot.capacity = updates.capacity
  if (updates.isActive !== undefined) slot.isActive = updates.isActive
  if (updates.startTime) slot.startTime = updates.startTime
  if (updates.endTime) slot.endTime = updates.endTime

  await slot.save()
  const safe = slot.toObject() as any
  delete safe._id
  return NextResponse.json(safe)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect()
  const payload = await getAuthToken()
  if (!payload || payload.role !== "blood_bank") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const slot = await DonationSlot.findOne({ id })
  if (!slot || slot.bloodBankId !== payload.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await DonationSlot.deleteOne({ id })

  // Cancel any active appointments for this slot
  await Appointment.updateMany(
    { slotId: id, status: "booked" },
    { $set: { status: "cancelled", notes: "Slot was cancelled by the blood bank." } }
  )

  return NextResponse.json({ success: true })
}

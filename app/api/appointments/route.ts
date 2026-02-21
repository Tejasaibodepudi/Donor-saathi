import { NextResponse } from "next/server"
import { appointments, donationSlots, donors, bloodBanks, generateId } from "@/lib/data/store"
import { getAuthToken } from "@/lib/auth"

export async function GET(req: Request) {
  const payload = await getAuthToken()
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")

  let items = Array.from(appointments.values())

  if (payload.role === "donor") {
    items = items.filter(a => a.donorId === payload.id)
  } else if (payload.role === "blood_bank") {
    items = items.filter(a => a.bloodBankId === payload.id)
  }

  if (status) items = items.filter(a => a.status === status)

  // Enrich with names
  const enriched = items.map(a => {
    const donor = donors.get(a.donorId)
    const bb = bloodBanks.get(a.bloodBankId)
    const slot = donationSlots.get(a.slotId)
    return {
      ...a,
      donorName: donor?.name || "Unknown",
      donorBloodGroup: donor?.bloodGroup || "Unknown",
      bloodBankName: bb?.name || "Unknown",
      slotDate: slot?.date || "",
      slotTime: slot ? `${slot.startTime} - ${slot.endTime}` : "",
    }
  })

  return NextResponse.json(enriched.sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()))
}

export async function POST(req: Request) {
  const payload = await getAuthToken()
  if (!payload || payload.role !== "donor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { slotId, bloodBankId } = await req.json()
  const slot = donationSlots.get(slotId)
  if (!slot || slot.bloodBankId !== bloodBankId) {
    return NextResponse.json({ error: "Slot not found" }, { status: 404 })
  }

  if (slot.booked >= slot.capacity) {
    return NextResponse.json({ error: "Slot is full" }, { status: 400 })
  }

  // Check for existing active booking
  const existing = Array.from(appointments.values()).find(
    a => a.donorId === payload.id && a.slotId === slotId && (a.status === "booked" || a.status === "checked_in")
  )
  if (existing) {
    return NextResponse.json({ error: "You already have an active booking for this slot" }, { status: 400 })
  }

  const id = generateId()
  const qrCode = `BSN-${id.slice(0, 8).toUpperCase()}`
  const apt = {
    id,
    donorId: payload.id,
    bloodBankId,
    slotId,
    qrCode,
    status: "booked" as const,
    bookedAt: new Date().toISOString(),
    checkedInAt: null,
    completedAt: null,
    notes: "",
  }

  slot.booked++
  donationSlots.set(slotId, slot)
  appointments.set(id, apt)

  return NextResponse.json(apt, { status: 201 })
}

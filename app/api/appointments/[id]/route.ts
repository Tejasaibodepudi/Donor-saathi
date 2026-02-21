import { NextResponse } from "next/server"
import { appointments, donationSlots, donors } from "@/lib/data/store"
import { getAuthToken } from "@/lib/auth"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const apt = appointments.get(id)
  if (!apt) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(apt)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getAuthToken()
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const apt = appointments.get(id)
  if (!apt) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const { action, notes } = await req.json()

  switch (action) {
    case "cancel": {
      if (apt.status !== "booked") {
        return NextResponse.json({ error: "Can only cancel booked appointments" }, { status: 400 })
      }
      apt.status = "cancelled"
      const slot = donationSlots.get(apt.slotId)
      if (slot) {
        slot.booked = Math.max(0, slot.booked - 1)
        donationSlots.set(slot.id, slot)
      }
      break
    }
    case "check_in": {
      if (payload.role !== "blood_bank") {
        return NextResponse.json({ error: "Only blood banks can check in" }, { status: 403 })
      }
      apt.status = "checked_in"
      apt.checkedInAt = new Date().toISOString()
      break
    }
    case "complete": {
      if (payload.role !== "blood_bank") {
        return NextResponse.json({ error: "Only blood banks can complete" }, { status: 403 })
      }
      apt.status = "completed"
      apt.completedAt = new Date().toISOString()
      if (notes) apt.notes = notes

      // Update donor stats
      const donor = donors.get(apt.donorId)
      if (donor) {
        donor.totalDonations++
        donor.lastDonation = new Date().toISOString()
        donor.trustScore = Math.min(100, donor.trustScore + 2)
        donors.set(donor.id, donor)
      }
      break
    }
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }

  appointments.set(id, apt)
  return NextResponse.json(apt)
}

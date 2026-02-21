import { NextResponse } from "next/server"
import { appointments, donors, bloodBanks, donationSlots } from "@/lib/data/store"
import { getAuthToken } from "@/lib/auth"

export async function POST(req: Request) {
  const payload = await getAuthToken()
  if (!payload || payload.role !== "blood_bank") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { qrCode } = await req.json()
  const apt = Array.from(appointments.values()).find(a => a.qrCode === qrCode)

  if (!apt) {
    return NextResponse.json({ error: "Invalid QR code - appointment not found" }, { status: 404 })
  }

  if (apt.bloodBankId !== payload.id) {
    return NextResponse.json({ error: "This appointment is for a different blood bank" }, { status: 403 })
  }

  const donor = donors.get(apt.donorId)
  const bb = bloodBanks.get(apt.bloodBankId)
  const slot = donationSlots.get(apt.slotId)

  return NextResponse.json({
    appointment: apt,
    donor: donor ? { id: donor.id, name: donor.name, bloodGroup: donor.bloodGroup, phone: donor.phone, trustScore: donor.trustScore } : null,
    bloodBank: bb ? { id: bb.id, name: bb.name } : null,
    slot: slot ? { date: slot.date, startTime: slot.startTime, endTime: slot.endTime } : null,
  })
}

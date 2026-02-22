import { NextResponse } from "next/server"
import dbConnect from "@/database/db"
import { Appointment, Donor, BloodBank, DonationSlot } from "@/database/models"
import { getAuthToken } from "@/lib/auth"

export async function POST(req: Request) {
  await dbConnect()
  const payload = await getAuthToken()
  if (!payload || payload.role !== "blood_bank") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { qrCode } = await req.json()
  const apt = await Appointment.findOne({ qrCode }).lean() as any

  if (!apt) {
    return NextResponse.json({ error: "Invalid QR code - appointment not found" }, { status: 404 })
  }

  if (apt.bloodBankId !== payload.id) {
    return NextResponse.json({ error: "This appointment is for a different blood bank" }, { status: 403 })
  }

  const [donor, bb, slot] = await Promise.all([
    Donor.findOne({ id: apt.donorId }).lean() as Promise<any>,
    BloodBank.findOne({ id: apt.bloodBankId }).lean() as Promise<any>,
    DonationSlot.findOne({ id: apt.slotId }).lean() as Promise<any>
  ])

  return NextResponse.json({
    appointment: apt,
    donor: donor ? { id: donor.id, name: donor.name, bloodGroup: donor.bloodGroup, phone: donor.phone, trustScore: donor.trustScore } : null,
    bloodBank: bb ? { id: bb.id, name: bb.name } : null,
    slot: slot ? { date: slot.date, startTime: slot.startTime, endTime: slot.endTime } : null,
  })
}

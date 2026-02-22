import { NextResponse } from "next/server"
import dbConnect from "@/database/db"
import { DonationSlot } from "@/database/models"
import { getAuthToken } from "@/lib/auth"

function generateId(): string {
  return `slot_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`
}

export async function GET(req: Request) {
  await dbConnect()
  const { searchParams } = new URL(req.url)
  const bloodBankId = searchParams.get("bloodBankId")
  const date = searchParams.get("date")

  const query: any = { isActive: true }
  if (bloodBankId) query.bloodBankId = bloodBankId
  if (date) query.date = date

  const slots = await DonationSlot.find(query).lean()
  return NextResponse.json(slots)
}

export async function POST(req: Request) {
  await dbConnect()
  const payload = await getAuthToken()
  if (!payload || payload.role !== "blood_bank") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const slot = new DonationSlot({
    id: generateId(),
    bloodBankId: payload.id,
    date: body.date,
    startTime: body.startTime,
    endTime: body.endTime,
    capacity: body.capacity || 5,
    booked: 0,
    isActive: true,
  })

  await slot.save()
  return NextResponse.json(slot, { status: 201 })
}

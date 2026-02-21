import { NextResponse } from "next/server"
import { donationSlots, generateId } from "@/lib/data/store"
import { getAuthToken } from "@/lib/auth"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const bloodBankId = searchParams.get("bloodBankId")
  const date = searchParams.get("date")

  let slots = Array.from(donationSlots.values())
  if (bloodBankId) slots = slots.filter(s => s.bloodBankId === bloodBankId)
  if (date) slots = slots.filter(s => s.date === date)

  return NextResponse.json(slots.filter(s => s.isActive))
}

export async function POST(req: Request) {
  const payload = await getAuthToken()
  if (!payload || payload.role !== "blood_bank") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const slot = {
    id: generateId(),
    bloodBankId: payload.id,
    date: body.date,
    startTime: body.startTime,
    endTime: body.endTime,
    capacity: body.capacity || 5,
    booked: 0,
    isActive: true,
  }
  donationSlots.set(slot.id, slot)
  return NextResponse.json(slot, { status: 201 })
}

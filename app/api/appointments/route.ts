import { NextResponse } from "next/server"
import dbConnect from "@/database/db"
import { Appointment, DonationSlot, Donor, BloodBank } from "@/database/models"
import { getAuthToken } from "@/lib/auth"

function generateId(): string {
  return `id_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`
}

export async function GET(req: Request) {
  await dbConnect()
  const payload = await getAuthToken()
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")

  const query: any = {}
  if (payload.role === "donor") query.donorId = payload.id
  else if (payload.role === "blood_bank") query.bloodBankId = payload.id
  if (status) query.status = status

  const items = await Appointment.find(query).lean() as any[]

  // Fetch dependencies in parallel to enrich
  const uniqueDonorIds = [...new Set(items.map(i => i.donorId))]
  const uniqueBbIds = [...new Set(items.map(i => i.bloodBankId))]
  const uniqueSlotIds = [...new Set(items.map(i => i.slotId))]

  const [donors, bbs, slots] = await Promise.all([
    Donor.find({ id: { $in: uniqueDonorIds } }).lean() as Promise<any[]>,
    BloodBank.find({ id: { $in: uniqueBbIds } }).lean() as Promise<any[]>,
    DonationSlot.find({ id: { $in: uniqueSlotIds } }).lean() as Promise<any[]>
  ])

  const donorMap = new Map(donors.map(d => [d.id, d]))
  const bbMap = new Map(bbs.map(b => [b.id, b]))
  const slotMap = new Map(slots.map(s => [s.id, s]))

  // Enrich with names
  const enriched = items.map(a => {
    const donor = donorMap.get(a.donorId)
    const bb = bbMap.get(a.bloodBankId)
    const slot = slotMap.get(a.slotId)
    return {
      ...a,
      donorName: donor?.name || "Unknown",
      donorBloodGroup: donor?.bloodGroup || "Unknown",
      donorTrustScore: donor?.trustScore || 50,
      bloodBankName: bb?.name || "Unknown",
      slotDate: slot?.date || "",
      slotTime: slot ? `${slot.startTime} - ${slot.endTime}` : "",
    }
  })

  return NextResponse.json(enriched.sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()))
}

export async function POST(req: Request) {
  await dbConnect()
  const payload = await getAuthToken()
  if (!payload || payload.role !== "donor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { slotId, bloodBankId } = await req.json()
  
  // Check 90-day donation cooldown
  const donor = await Donor.findOne({ id: payload.id })
  if (donor && donor.lastDonation) {
    const lastDonationDate = new Date(donor.lastDonation)
    const daysSinceLastDonation = Math.floor((Date.now() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24))
    const daysRemaining = 90 - daysSinceLastDonation
    
    if (daysRemaining > 0) {
      return NextResponse.json({ 
        error: `You must wait ${daysRemaining} more days before donating again. Last donation was ${daysSinceLastDonation} days ago.`,
        daysRemaining,
        lastDonation: donor.lastDonation
      }, { status: 400 })
    }
  }

  const slot = await DonationSlot.findOne({ id: slotId })
  if (!slot || slot.bloodBankId !== bloodBankId) {
    return NextResponse.json({ error: "Slot not found" }, { status: 404 })
  }

  if (slot.booked >= slot.capacity) {
    return NextResponse.json({ error: "Slot is full" }, { status: 400 })
  }

  // Check for existing active booking
  const existing = await Appointment.findOne({
    donorId: payload.id,
    slotId,
    status: { $in: ["booked", "checked_in"] }
  })

  if (existing) {
    return NextResponse.json({ error: "You already have an active booking for this slot" }, { status: 400 })
  }

  const id = generateId()
  const qrCode = `BSN-${id.slice(0, 8).toUpperCase()}`

  const apt = new Appointment({
    id,
    donorId: payload.id,
    bloodBankId,
    slotId,
    qrCode,
    status: "booked",
    bookedAt: new Date().toISOString(),
    checkedInAt: null,
    completedAt: null,
    notes: "",
  })

  slot.booked++

  await Promise.all([
    slot.save(),
    apt.save()
  ])

  return NextResponse.json(apt, { status: 201 })
}

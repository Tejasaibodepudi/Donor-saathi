import { NextResponse } from "next/server"
import dbConnect from "@/database/db"
import { Appointment, DonationSlot, Donor, InventoryItem } from "@/database/models"
import { getAuthToken } from "@/lib/auth"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect()
  const { id } = await params
  const apt = await Appointment.findOne({ id }).lean()
  if (!apt) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(apt)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect()
  const payload = await getAuthToken()
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const apt = await Appointment.findOne({ id })
  if (!apt) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const { action, notes } = await req.json()

  switch (action) {
    case "cancel": {
      if (apt.status !== "booked") {
        return NextResponse.json({ error: "Can only cancel booked appointments" }, { status: 400 })
      }
      apt.status = "cancelled"
      const slot = await DonationSlot.findOne({ id: apt.slotId })
      if (slot) {
        slot.booked = Math.max(0, slot.booked - 1)
        await slot.save()
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
      const donor = await Donor.findOne({ id: apt.donorId })
      if (donor) {
        donor.totalDonations++
        donor.lastDonation = new Date().toISOString()
        donor.trustScore = Math.min(100, donor.trustScore + 2)
        await donor.save()

        // Add 1 unit to blood bank inventory
        const inventoryItem = await InventoryItem.findOne({
          bloodBankId: apt.bloodBankId,
          bloodGroup: donor.bloodGroup
        })

        if (inventoryItem) {
          // Update existing inventory
          inventoryItem.units += 1
          inventoryItem.lastUpdated = new Date().toISOString()
          await inventoryItem.save()
        } else {
          // Create new inventory item if it doesn't exist
          const newInventoryId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          await InventoryItem.create({
            id: newInventoryId,
            bloodBankId: apt.bloodBankId,
            bloodGroup: donor.bloodGroup,
            units: 1,
            lastUpdated: new Date().toISOString()
          })
        }
      }
      break
    }
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }

  await apt.save()
  return NextResponse.json(apt)
}

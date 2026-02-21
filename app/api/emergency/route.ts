import { NextResponse } from "next/server"
import { emergencyRequests, generateId } from "@/lib/data/store"
import { getAuthToken } from "@/lib/auth"
import type { EmergencyRequest } from "@/lib/data/types"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const bloodGroup = searchParams.get("bloodGroup")

  let items = Array.from(emergencyRequests.values())
  if (status) items = items.filter(e => e.status === status)
  if (bloodGroup) items = items.filter(e => e.bloodGroup === bloodGroup)

  return NextResponse.json(items.sort((a, b) => {
    const priorityOrder = { critical: 0, urgent: 1, normal: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  }))
}

export async function POST(req: Request) {
  const payload = await getAuthToken()
  if (!payload || (payload.role !== "hospital" && payload.role !== "blood_bank")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const id = generateId()

  const emergency: EmergencyRequest = {
    id,
    requesterId: payload.id,
    requesterType: payload.role as "hospital" | "blood_bank",
    requesterName: payload.name,
    bloodGroup: body.bloodGroup,
    unitsNeeded: body.unitsNeeded,
    unitsFulfilled: 0,
    priority: body.priority || "urgent",
    status: "active",
    contactPhone: body.contactPhone || "",
    hospital: body.hospital || payload.name,
    reason: body.reason || "",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  }

  emergencyRequests.set(id, emergency)
  return NextResponse.json(emergency, { status: 201 })
}

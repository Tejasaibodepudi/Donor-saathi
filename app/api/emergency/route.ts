import { NextResponse } from "next/server"
import dbConnect from "@/database/db"
import { EmergencyRequest } from "@/database/models"
import { getAuthToken } from "@/lib/auth"

function generateId(): string {
  return `id_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`
}

export async function GET(req: Request) {
  await dbConnect()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const bloodGroup = searchParams.get("bloodGroup")

  const query: any = {}
  if (status) query.status = status
  if (bloodGroup) query.bloodGroup = bloodGroup

  const items = await EmergencyRequest.find(query).lean() as any[]

  const priorityOrder: Record<string, number> = { critical: 0, urgent: 1, normal: 2 }
  items.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  return NextResponse.json(items)
}

export async function POST(req: Request) {
  await dbConnect()
  const payload = await getAuthToken()
  if (!payload || (payload.role !== "hospital" && payload.role !== "blood_bank")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  const emergency = new EmergencyRequest({
    id: generateId(),
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
  })

  await emergency.save()

  const safe = emergency.toObject() as any
  delete safe._id
  return NextResponse.json(safe, { status: 201 })
}

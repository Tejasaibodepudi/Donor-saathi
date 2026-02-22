import { NextResponse } from "next/server"
import dbConnect from "@/database/db"
import { EmergencyRequest } from "@/database/models"
import { getAuthToken } from "@/lib/auth"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect()
  const payload = await getAuthToken()
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const emergency = await EmergencyRequest.findOne({ id })
  if (!emergency) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (body.unitsFulfilled !== undefined) {
    emergency.unitsFulfilled = body.unitsFulfilled
    if (emergency.unitsFulfilled >= emergency.unitsNeeded) {
      emergency.status = "fulfilled"
    } else if (emergency.unitsFulfilled > 0) {
      emergency.status = "partially_fulfilled"
    }
  }

  if (body.status) emergency.status = body.status

  await emergency.save()

  const safe = emergency.toObject() as any
  delete safe._id
  return NextResponse.json(safe)
}

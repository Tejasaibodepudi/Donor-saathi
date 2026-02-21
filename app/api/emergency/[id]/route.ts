import { NextResponse } from "next/server"
import { emergencyRequests } from "@/lib/data/store"
import { getAuthToken } from "@/lib/auth"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getAuthToken()
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const emergency = emergencyRequests.get(id)
  if (!emergency) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const body = await req.json()

  if (body.unitsFulfilled !== undefined) {
    emergency.unitsFulfilled = body.unitsFulfilled
    if (emergency.unitsFulfilled >= emergency.unitsNeeded) {
      emergency.status = "fulfilled"
    } else if (emergency.unitsFulfilled > 0) {
      emergency.status = "partially_fulfilled"
    }
  }

  if (body.status) emergency.status = body.status

  emergencyRequests.set(id, emergency)
  return NextResponse.json(emergency)
}

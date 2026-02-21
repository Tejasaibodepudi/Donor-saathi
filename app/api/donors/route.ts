import { NextResponse } from "next/server"
import { donors } from "@/lib/data/store"
import { getAuthToken } from "@/lib/auth"

export async function GET() {
  const all = Array.from(donors.values()).map(({ password: _, ...d }) => d)
  return NextResponse.json(all)
}

export async function PATCH(req: Request) {
  const payload = await getAuthToken()
  if (!payload || payload.role !== "donor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const donor = donors.get(payload.id)
  if (!donor) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const updates = await req.json()
  const allowed = ["name", "phone", "bloodGroup", "address", "city", "state", "isAvailable", "gender", "dateOfBirth"]
  for (const key of allowed) {
    if (key in updates) {
      (donor as Record<string, unknown>)[key] = updates[key]
    }
  }
  donors.set(donor.id, donor)
  const { password: _, ...safe } = donor
  return NextResponse.json(safe)
}

import { NextResponse } from "next/server"
import { donors, bloodBanks, hospitals } from "@/lib/data/store"
import { getAuthToken } from "@/lib/auth"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getAuthToken()
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { action } = await req.json() as { action: "verify" | "block" | "unblock" }

  // Find user across all stores
  const donor = donors.get(id)
  if (donor) {
    if (action === "block") donor.status = "blocked"
    else if (action === "unblock") donor.status = "active"
    donors.set(id, donor)
    const { password: _, ...safe } = donor
    return NextResponse.json(safe)
  }

  const bb = bloodBanks.get(id)
  if (bb) {
    if (action === "verify") bb.status = "verified"
    else if (action === "block") bb.status = "blocked"
    else if (action === "unblock") bb.status = "verified"
    bloodBanks.set(id, bb)
    const { password: _, ...safe } = bb
    return NextResponse.json(safe)
  }

  const hosp = hospitals.get(id)
  if (hosp) {
    if (action === "verify") hosp.status = "verified"
    else if (action === "block") hosp.status = "blocked"
    else if (action === "unblock") hosp.status = "verified"
    hospitals.set(id, hosp)
    const { password: _, ...safe } = hosp
    return NextResponse.json(safe)
  }

  return NextResponse.json({ error: "User not found" }, { status: 404 })
}

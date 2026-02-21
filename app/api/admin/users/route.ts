import { NextResponse } from "next/server"
import { donors, bloodBanks, hospitals } from "@/lib/data/store"
import { getAuthToken } from "@/lib/auth"

export async function GET(req: Request) {
  const payload = await getAuthToken()
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const type = searchParams.get("type")

  const results: Record<string, unknown>[] = []

  if (!type || type === "donor") {
    Array.from(donors.values()).forEach(({ password: _, ...d }) => {
      results.push({ ...d, role: "donor", verified: d.status === "active", blocked: d.status === "blocked" })
    })
  }
  if (!type || type === "blood_bank") {
    Array.from(bloodBanks.values()).forEach(({ password: _, ...b }) => {
      results.push({ ...b, role: "blood_bank", verified: b.status === "verified", blocked: b.status === "blocked" })
    })
  }
  if (!type || type === "hospital") {
    Array.from(hospitals.values()).forEach(({ password: _, ...h }) => {
      results.push({ ...h, role: "hospital", verified: h.status === "verified", blocked: h.status === "blocked" })
    })
  }

  return NextResponse.json(results)
}

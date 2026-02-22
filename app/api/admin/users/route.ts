import { NextResponse } from "next/server"
import dbConnect from "@/database/db"
import { Donor, BloodBank, Hospital, Institution } from "@/database/models"
import { getAuthToken } from "@/lib/auth"

export async function GET(req: Request) {
  await dbConnect()
  const payload = await getAuthToken()
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const type = searchParams.get("type")

  const results: Record<string, unknown>[] = []

  if (!type || type === "donor") {
    const donors = await Donor.find({}).select("-password -_id").lean() as any[]
    donors.forEach(d => {
      results.push({ ...d, role: "donor", verified: d.status === "active", blocked: d.status === "blocked" })
    })
  }
  if (!type || type === "blood_bank") {
    const bbs = await BloodBank.find({}).select("-password -_id").lean() as any[]
    bbs.forEach(b => {
      results.push({ ...b, role: "blood_bank", verified: b.status === "verified", blocked: b.status === "blocked" })
    })
  }
  if (!type || type === "hospital") {
    const hospitals = await Hospital.find({}).select("-password -_id").lean() as any[]
    hospitals.forEach(h => {
      results.push({ ...h, role: "hospital", verified: h.status === "verified", blocked: h.status === "blocked" })
    })
  }
  if (!type || type === "institution") {
    const institutions = await Institution.find({}).select("-password -_id").lean() as any[]
    institutions.forEach(i => {
      results.push({ ...i, role: "institution", verified: i.status === "verified", blocked: i.status === "blocked" })
    })
  }

  return NextResponse.json(results)
}

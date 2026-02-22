import { NextResponse } from "next/server"
import dbConnect from "@/database/db"
import { Donor, BloodBank, Hospital, Institution } from "@/database/models"
import { getAuthToken } from "@/lib/auth"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect()
  const payload = await getAuthToken()
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { action } = await req.json() as { action: "verify" | "block" | "unblock" }

  const donor = await Donor.findOne({ id })
  if (donor) {
    if (action === "block") donor.status = "blocked"
    else if (action === "unblock") donor.status = "active"
    await donor.save()
    const safe = donor.toObject() as any
    delete safe.password
    delete safe._id
    return NextResponse.json(safe)
  }

  const bb = await BloodBank.findOne({ id })
  if (bb) {
    if (action === "verify") bb.status = "verified"
    else if (action === "block") bb.status = "blocked"
    else if (action === "unblock") bb.status = "verified"
    await bb.save()
    const safe = bb.toObject() as any
    delete safe.password
    delete safe._id
    return NextResponse.json(safe)
  }

  const hosp = await Hospital.findOne({ id })
  if (hosp) {
    if (action === "verify") hosp.status = "verified"
    else if (action === "block") hosp.status = "blocked"
    else if (action === "unblock") hosp.status = "verified"
    await hosp.save()
    const safe = hosp.toObject() as any
    delete safe.password
    delete safe._id
    return NextResponse.json(safe)
  }

  const inst = await Institution.findOne({ id })
  if (inst) {
    if (action === "verify") inst.status = "verified"
    else if (action === "block") inst.status = "blocked"
    else if (action === "unblock") inst.status = "verified"
    await inst.save()
    const safe = inst.toObject() as any
    delete safe.password
    delete safe._id
    return NextResponse.json(safe)
  }

  return NextResponse.json({ error: "User not found" }, { status: 404 })
}

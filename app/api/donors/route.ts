import { NextResponse } from "next/server"
import dbConnect from "@/database/db"
import { Donor } from "@/database/models"
import { getAuthToken } from "@/lib/auth"

export async function GET() {
  await dbConnect()
  const all = await Donor.find({}).select("-password -_id").lean()
  return NextResponse.json(all)
}

export async function PATCH(req: Request) {
  await dbConnect()
  const payload = await getAuthToken()
  if (!payload || payload.role !== "donor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const donor = await Donor.findOne({ id: payload.id })
  if (!donor) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const updates = await req.json()
  const allowed = ["name", "phone", "bloodGroup", "address", "city", "state", "isAvailable", "gender", "dateOfBirth"]
  for (const key of allowed) {
    if (key in updates) {
      donor[key] = updates[key]
    }
  }
  await donor.save()

  const safe = donor.toObject() as any
  delete safe.password
  delete safe._id
  return NextResponse.json(safe)
}

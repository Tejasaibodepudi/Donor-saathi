import { NextResponse } from "next/server"
import dbConnect from "@/database/db"
import { Donor, BloodBank, Hospital, Admin, Institution } from "@/database/models"
import { createToken, setAuthCookie } from "@/lib/auth"
import type { UserRole } from "@/lib/data/types"

export async function POST(req: Request) {
  await dbConnect()

  const { email, password, role } = await req.json() as { email: string; password: string; role: UserRole }

  if (!email || !password || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  let user: { id: string; name: string; email: string; password: string } | null = null

  switch (role) {
    case "donor":
      user = await Donor.findOne({ email }).lean() as any
      break
    case "blood_bank":
      user = await BloodBank.findOne({ email }).lean() as any
      break
    case "hospital":
      user = await Hospital.findOne({ email }).lean() as any
      break
    case "admin":
      user = await Admin.findOne({ email }).lean() as any
      break
    case "institution":
      user = await Institution.findOne({ email }).lean() as any
      break
  }

  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  }

  const token = createToken({ id: user.id, email: user.email, role, name: user.name })
  await setAuthCookie(token)

  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role },
  })
}

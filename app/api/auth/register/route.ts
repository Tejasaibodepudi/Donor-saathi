import { NextResponse } from "next/server"
import { donors, bloodBanks, hospitals, generateId } from "@/lib/data/store"
import { createToken, setAuthCookie } from "@/lib/auth"
import type { UserRole, Donor, BloodBank, Hospital } from "@/lib/data/types"

export async function POST(req: Request) {
  const body = await req.json()
  const { role, email, name, password } = body as { role: UserRole; email: string; name: string; password: string }

  if (!role || !email || !name || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Check if email already exists
  const allEmails = [
    ...Array.from(donors.values()).map(d => d.email),
    ...Array.from(bloodBanks.values()).map(b => b.email),
    ...Array.from(hospitals.values()).map(h => h.email),
  ]
  if (allEmails.includes(email)) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 })
  }

  const id = generateId()
  const now = new Date().toISOString()

  if (role === "donor") {
    const donor: Donor = {
      id, name, email, password,
      phone: body.phone || "", bloodGroup: body.bloodGroup || "O+",
      dateOfBirth: body.dateOfBirth || "1990-01-01", gender: body.gender || "other",
      address: body.address || "", city: body.city || "", state: body.state || "",
      lat: 0, lng: 0, isAvailable: true, lastDonation: null,
      totalDonations: 0, trustScore: 50, status: "active", createdAt: now,
    }
    donors.set(id, donor)
  } else if (role === "blood_bank") {
    const bb: BloodBank = {
      id, name, email, password,
      phone: body.phone || "", licenseNumber: body.licenseNumber || "",
      address: body.address || "", city: body.city || "", state: body.state || "",
      lat: 0, lng: 0, operatingHours: body.operatingHours || "9:00 AM - 5:00 PM",
      status: "pending", createdAt: now,
    }
    bloodBanks.set(id, bb)
  } else if (role === "hospital") {
    const hosp: Hospital = {
      id, name, email, password,
      phone: body.phone || "", registrationNumber: body.registrationNumber || "",
      address: body.address || "", city: body.city || "", state: body.state || "",
      lat: 0, lng: 0, departments: body.departments ? body.departments.split(",") : [],
      status: "pending", createdAt: now,
    }
    hospitals.set(id, hosp)
  } else {
    return NextResponse.json({ error: "Cannot register as admin" }, { status: 403 })
  }

  const token = createToken({ id, email, role, name })
  await setAuthCookie(token)

  return NextResponse.json({ user: { id, name, email, role } })
}

import { NextResponse } from "next/server"
import dbConnect from "@/database/db"
import { Donor, BloodBank, Hospital, Admin, RareDonorProfile, Institution } from "@/database/models"
import { createToken, setAuthCookie } from "@/lib/auth"
import { FEATURE_FLAGS } from "@/lib/features"

function generateId(): string {
  return `id_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`
}

export async function POST(req: Request) {
  try {
    await dbConnect()

    const body = await req.json()
    const { role, email, name, password, optInRareRegistry, dateOfBirth } = body as any

    if (!role || !email || !name || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Age verification for donors
    if (role === "donor") {
      if (!dateOfBirth) {
        return NextResponse.json({ error: "Date of birth is required for donors" }, { status: 400 })
      }

      const birthDate = new Date(dateOfBirth)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      if (age < 18) {
        return NextResponse.json({ error: "You must be at least 18 years old to register as a donor" }, { status: 400 })
      }
    }

    // Check if email already exists globally
    const [d, b, h, a, i] = await Promise.all([
      Donor.exists({ email }),
      BloodBank.exists({ email }),
      Hospital.exists({ email }),
      Admin.exists({ email }),
      Institution.exists({ email })
    ])

    if (d || b || h || a || i) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    const id = generateId()
    const now = new Date().toISOString()

    if (role === "donor") {
      const donor = new Donor({
        id, name, email, password,
        phone: body.phone || "", bloodGroup: body.bloodGroup || "O+",
        dateOfBirth: body.dateOfBirth || "1990-01-01", gender: body.gender || "other",
        address: body.address || "", city: body.city || "", state: body.state || "",
        lat: 0, lng: 0, isAvailable: true, lastDonation: null,
        totalDonations: 0, trustScore: 50, status: "active", createdAt: now,
      })
      await donor.save()

      // Optional: Opt-in to Rare Blood Network (only for eligible blood groups)
      const eligibleBloodGroups = ["A-", "B-", "AB+", "AB-"]
      if (FEATURE_FLAGS.RARE_DONOR_REGISTRY && optInRareRegistry && eligibleBloodGroups.includes(donor.bloodGroup)) {
        const rareProfile = new RareDonorProfile({
          id: generateId(),
          userId: id,
          bloodGroup: donor.bloodGroup,
          isRareConfirmed: false,
          privacyLevel: "ANONYMIZED", // Strict default
          emergencyContactEnabled: false,
          isActive: false, // Inactive until verified
          lastAvailabilityUpdate: now,
          verificationStatus: "PENDING",
          verifiedByAdminId: null,
          verificationProofUrl: null, // They upload this later in dashboard
          createdAt: now,
          updatedAt: now,
        })
        await rareProfile.save()
      }
    } else if (role === "blood_bank") {
      const bb = new BloodBank({
        id, name, email, password,
        phone: body.phone || "", licenseNumber: body.licenseNumber || "",
        address: body.address || "", city: body.city || "", state: body.state || "",
        lat: 0, lng: 0, operatingHours: body.operatingHours || "9:00 AM - 5:00 PM",
        status: "pending", createdAt: now,
      })
      await bb.save()
    } else if (role === "hospital") {
      const hosp = new Hospital({
        id, name, email, password,
        phone: body.phone || "", registrationNumber: body.registrationNumber || "",
        address: body.address || "", city: body.city || "", state: body.state || "",
        lat: 0, lng: 0, departments: body.departments ? body.departments.split(",") : [],
        status: "pending", createdAt: now,
      })
      await hosp.save()
    } else if (role === "institution") {
      const inst = new Institution({
        id, name, email, password,
        phone: body.phone || "", address: body.address || "", city: body.city || "", state: body.state || "",
        lat: 0, lng: 0, status: "pending", createdAt: now,
      })
      await inst.save()
    } else {
      return NextResponse.json({ error: "Cannot register as admin" }, { status: 403 })
    }

    const token = createToken({ id, email, role, name })
    await setAuthCookie(token)

    return NextResponse.json({ user: { id, name, email, role } })
  } catch (error: any) {
    console.error("REGISTRATION ERROR:", error);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/database/db"
import { RareDonorProfile, Donor } from "@/database/models"
import { FEATURE_FLAGS } from "@/lib/features"

function generateId(): string {
    return `id_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`
}

// Eligible blood groups for rare donor registry
const ELIGIBLE_BLOOD_GROUPS = ["A-", "B-", "AB+", "AB-"]

export async function GET() {
    if (!FEATURE_FLAGS.RARE_DONOR_REGISTRY) return NextResponse.json({ error: "Feature disabled" }, { status: 404 })

    try {
        await dbConnect()
        const auth = await requireAuth(["donor"])

        const profile = await RareDonorProfile.findOne({ userId: auth.id }).lean()

        if (!profile) {
            return NextResponse.json({ profile: null })
        }

        const safe = profile as any
        delete safe._id
        return NextResponse.json({ profile: safe })
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}

export async function POST(req: Request) {
    if (!FEATURE_FLAGS.RARE_DONOR_REGISTRY) return NextResponse.json({ error: "Feature disabled" }, { status: 404 })

    try {
        await dbConnect()
        const auth = await requireAuth(["donor"])
        const body = await req.json()

        const baseDonor = await Donor.findOne({ id: auth.id }).lean() as any
        if (!baseDonor) return NextResponse.json({ error: "Donor not found" }, { status: 404 })

        // Check if donor's blood group is eligible for rare donor registry
        if (!ELIGIBLE_BLOOD_GROUPS.includes(baseDonor.bloodGroup)) {
            return NextResponse.json({ 
                error: "Only donors with blood groups A-, B-, AB+, and AB- are eligible for the Rare Donor Registry" 
            }, { status: 403 })
        }

        let profile = await RareDonorProfile.findOne({ userId: auth.id })

        if (profile) {
            profile.privacyLevel = body.privacyLevel || profile.privacyLevel
            profile.emergencyContactEnabled = body.emergencyContactEnabled ?? profile.emergencyContactEnabled
            if (body.verificationProofUrl && !profile.isRareConfirmed) {
                profile.verificationProofUrl = body.verificationProofUrl
                profile.verificationStatus = "PENDING"
            }
            profile.updatedAt = new Date().toISOString()
            await profile.save()

            const safe = profile.toObject() as any
            delete safe._id
            return NextResponse.json({ profile: safe })
        }

        profile = new RareDonorProfile({
            id: generateId(),
            userId: auth.id,
            bloodGroup: baseDonor.bloodGroup,
            isRareConfirmed: false,
            privacyLevel: body.privacyLevel || "ANONYMIZED",
            emergencyContactEnabled: !!body.emergencyContactEnabled,
            isActive: false, // Inactive until verified
            lastAvailabilityUpdate: new Date().toISOString(),
            verificationStatus: "PENDING",
            verifiedByAdminId: null,
            verificationProofUrl: body.verificationProofUrl || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })

        await profile.save()
        const safe = profile.toObject() as any
        delete safe._id

        return NextResponse.json({ profile: safe })
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized or bad request" }, { status: 401 })
    }
}

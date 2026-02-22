import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/database/db"
import { RareDonorProfile, Donor, AdminAuditLog } from "@/database/models"
import { FEATURE_FLAGS } from "@/lib/features"

function generateId(): string {
    return `id_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`
}

export async function GET() {
    if (!FEATURE_FLAGS.RARE_DONOR_REGISTRY) return NextResponse.json({ error: "Feature disabled" }, { status: 404 })

    try {
        await dbConnect()
        await requireAuth(["admin"])

        const profiles = await RareDonorProfile.find({}).lean() as any[]
        const userIds = profiles.map(p => p.userId)
        const donors = await Donor.find({ id: { $in: userIds } }).lean() as any[]
        const donorMap = new Map(donors.map(d => [d.id, d]))

        const mapped = profiles.map(p => {
            const donorDetails = donorMap.get(p.userId)
            return {
                ...p,
                donorName: donorDetails?.name,
                donorEmail: donorDetails?.email,
                donorPhone: donorDetails?.phone,
            }
        })

        return NextResponse.json({ profiles: mapped })
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}

export async function PATCH(req: Request) {
    if (!FEATURE_FLAGS.RARE_DONOR_REGISTRY) return NextResponse.json({ error: "Feature disabled" }, { status: 404 })

    try {
        await dbConnect()
        const auth = await requireAuth(["admin"])
        const body = await req.json()
        const { profileId, status, details } = body

        if (!profileId || !status) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

        const profile = await RareDonorProfile.findOne({ id: profileId })
        if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 })

        profile.verificationStatus = status
        profile.verifiedByAdminId = auth.id
        if (status === "VERIFIED") {
            profile.isRareConfirmed = true
            profile.isActive = true
        }
        profile.updatedAt = new Date().toISOString()

        const logId = generateId()
        const log = new AdminAuditLog({
            id: logId,
            adminId: auth.id,
            action: status === "VERIFIED" ? "VERIFY_DONOR" : "REJECT_DONOR",
            targetId: profile.userId,
            details: details || `Changed status to ${status}`,
            createdAt: new Date().toISOString()
        })

        await Promise.all([profile.save(), log.save()])

        const safe = profile.toObject() as any
        delete safe._id
        return NextResponse.json({ profile: safe })
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}

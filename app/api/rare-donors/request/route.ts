import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/database/db"
import { RareDonorRequest, RareDonorProfile, RareAlertQueue } from "@/database/models"
import { FEATURE_FLAGS } from "@/lib/features"

function getDistanceScore(profileLat: number, profileLng: number, reqLat: number, reqLng: number) {
    return 100
}

function generateId(): string {
    return `id_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`
}

export async function GET() {
    if (!FEATURE_FLAGS.RARE_DONOR_REGISTRY) return NextResponse.json({ error: "Feature disabled" }, { status: 404 })

    try {
        await dbConnect()
        const auth = await requireAuth(["hospital", "blood_bank"])

        const requests = await RareDonorRequest.find({ requesterId: auth.id }).lean()

        const sanitizedRequests = requests.map((req: any) => ({
            id: req.id,
            requesterType: req.requesterType,
            requiredBloodGroup: req.requiredBloodGroup,
            urgencyLevel: req.urgencyLevel,
            status: req.status,
            matchedDonorCount: req.matchedDonorCount,
            createdAt: req.createdAt,
        }))

        return NextResponse.json({ requests: sanitizedRequests })
    } catch (error: any) {
        console.error("Rare donor request GET error:", error)
        if (error.message === "Unauthorized" || error.message === "Forbidden") {
            return NextResponse.json({ error: error.message }, { status: 401 })
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    if (!FEATURE_FLAGS.RARE_DONOR_REGISTRY) return NextResponse.json({ error: "Feature disabled" }, { status: 404 })

    try {
        await dbConnect()
        const auth = await requireAuth(["hospital", "blood_bank"])
        const body = await req.json()

        if (!body.requiredBloodGroup || !body.urgencyLevel || !body.location) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const activeVerifiedDonors = await RareDonorProfile.find({
            isActive: true,
            verificationStatus: "VERIFIED",
            bloodGroup: body.requiredBloodGroup
        }).lean() as any[]

        let matchedCount = 0
        const alertsToQueue: any[] = []
        const requestId = generateId()

        const now = Date.now()
        const COOLDOWN_MS = 24 * 60 * 60 * 1000

        for (const donor of activeVerifiedDonors) {
            const lastAlertTs = new Date(donor.lastAvailabilityUpdate).getTime()
            if (now - lastAlertTs < COOLDOWN_MS) {
                continue
            }

            const alreadyAlerted = await RareAlertQueue.exists({
                requestId,
                donorUserId: donor.userId
            })
            if (alreadyAlerted) continue

            if (donor.privacyLevel === "FULL_ADMIN_ONLY") {
                continue
            }

            if (donor.privacyLevel === "EMERGENCY_ONLY" && body.urgencyLevel !== "critical") {
                continue
            }

            matchedCount++

            alertsToQueue.push({
                id: generateId(),
                requestId,
                donorUserId: donor.userId,
                alertStatus: "PENDING",
                priorityScore: getDistanceScore(0, 0, body.location.lat, body.location.lng),
                createdAt: new Date().toISOString()
            })
        }

        const newRequest = new RareDonorRequest({
            id: requestId,
            requesterType: auth.role === "hospital" ? "HOSPITAL" : "BLOOD_BANK",
            requesterId: auth.id,
            requiredBloodGroup: body.requiredBloodGroup,
            urgencyLevel: body.urgencyLevel,
            location: {
                lat: body.location.lat,
                lng: body.location.lng,
                city: body.location.city || "Unknown"
            },
            status: "OPEN",
            matchedDonorCount: matchedCount,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })

        await newRequest.save()
        if (alertsToQueue.length > 0) {
            await RareAlertQueue.insertMany(alertsToQueue)
        }

        return NextResponse.json({
            request: {
                id: newRequest.id,
                matchedDonorCount: newRequest.matchedDonorCount,
                status: newRequest.status
            }
        })
    } catch (error: any) {
        console.error("Rare donor request POST error:", error)
        if (error.message === "Unauthorized" || error.message === "Forbidden") {
            return NextResponse.json({ error: error.message }, { status: 401 })
        }
        return NextResponse.json({ error: "Internal server error: " + error.message }, { status: 500 })
    }
}

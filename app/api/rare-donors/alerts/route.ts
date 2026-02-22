import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/database/db"
import { RareAlertQueue, RareDonorProfile } from "@/database/models"
import { FEATURE_FLAGS } from "@/lib/features"

export async function GET() {
    if (!FEATURE_FLAGS.RARE_DONOR_REGISTRY) return NextResponse.json({ error: "Feature disabled" }, { status: 404 })

    try {
        await dbConnect()
        const auth = await requireAuth(["donor"])

        const myAlerts = await RareAlertQueue.find({ donorUserId: auth.id }).lean()
        return NextResponse.json({ alerts: myAlerts })
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}

export async function PATCH(req: Request) {
    if (!FEATURE_FLAGS.RARE_DONOR_REGISTRY) return NextResponse.json({ error: "Feature disabled" }, { status: 404 })

    try {
        await dbConnect()
        const auth = await requireAuth(["donor"])
        const body = await req.json()
        const { alertId, action } = body

        if (!alertId || !action) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

        const alert = await RareAlertQueue.findOne({ id: alertId })
        if (!alert || alert.donorUserId !== auth.id) {
            return NextResponse.json({ error: "Alert not found" }, { status: 404 })
        }

        if (action === "ACCEPT") {
            alert.alertStatus = "ACKNOWLEDGED"

            const profile = await RareDonorProfile.findOne({ userId: auth.id })
            if (profile) {
                profile.lastAvailabilityUpdate = new Date().toISOString()
                await profile.save()
            }
        } else if (action === "DECLINE") {
            alert.alertStatus = "DECLINED"
        }

        await alert.save()

        const safe = alert.toObject() as any
        delete safe._id
        return NextResponse.json({ alert: safe })
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}

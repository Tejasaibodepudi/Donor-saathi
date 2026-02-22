import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/database/db"
import { AdminAuditLog } from "@/database/models"
import { FEATURE_FLAGS } from "@/lib/features"

export async function GET() {
    if (!FEATURE_FLAGS.RARE_DONOR_REGISTRY) return NextResponse.json({ error: "Feature disabled" }, { status: 404 })

    try {
        await dbConnect()
        await requireAuth(["admin"])

        const logs = await AdminAuditLog.find({}).sort({ createdAt: -1 }).lean()
        return NextResponse.json({ logs })
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}

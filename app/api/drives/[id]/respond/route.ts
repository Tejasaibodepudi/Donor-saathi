import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/database/db"
import { BloodDrive } from "@/database/models"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect()
        const auth = await requireAuth(["blood_bank"])
        const { id } = await params
        const body = await req.json()

        if (!["approved", "declined", "completed"].includes(body.status)) {
            return NextResponse.json({ error: "Invalid status update" }, { status: 400 })
        }

        const drive = await BloodDrive.findOne({ id })
        if (!drive) return NextResponse.json({ error: "Drive not found" }, { status: 404 })

        if (drive.bloodBankId !== auth.id) {
            return NextResponse.json({ error: "Unauthorized to approve this drive" }, { status: 403 })
        }

        drive.status = body.status
        drive.updatedAt = new Date().toISOString()

        await drive.save()

        const safe = drive.toObject() as any
        delete safe._id
        return NextResponse.json(safe)
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}

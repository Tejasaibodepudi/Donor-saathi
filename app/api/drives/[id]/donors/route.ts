import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/database/db"
import { BloodDrive, BloodDriveDonor } from "@/database/models"

function generateId(): string {
    return `dd_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect()
        await requireAuth(["institution", "blood_bank", "admin"])
        const { id } = await params

        const donors = await BloodDriveDonor.find({ driveId: id }).sort({ createdAt: -1 }).lean()
        return NextResponse.json(donors)
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect()
        const auth = await requireAuth(["institution"])
        const { id } = await params
        const body = await req.json()

        const drive = await BloodDrive.findOne({ id })
        if (!drive || drive.institutionId !== auth.id) {
            return NextResponse.json({ error: "Drive not found or unauthorized" }, { status: 404 })
        }

        if (drive.status !== "approved") {
            return NextResponse.json({ error: "Cannot register donors for unapproved drives" }, { status: 400 })
        }

        // Support bulk array or single object
        const payload = Array.isArray(body) ? body : [body]
        const newDonors = payload.map(d => ({
            id: generateId(),
            driveId: id,
            name: d.name,
            bloodGroup: d.bloodGroup || "Unknown",
            status: d.status || "registered",
            createdAt: new Date().toISOString(),
        }))

        await BloodDriveDonor.insertMany(newDonors)

        return NextResponse.json({ success: true, count: newDonors.length })
    } catch (error) {
        return NextResponse.json({ error: "Invalid Request" }, { status: 400 })
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect()
        const auth = await requireAuth(["institution", "blood_bank"])
        const { id } = await params
        const { donorId, status, bloodGroup } = await req.json()

        const drive = await BloodDrive.findOne({ id })
        if (!drive) return NextResponse.json({ error: "Drive not found" }, { status: 404 })

        const donor = await BloodDriveDonor.findOne({ id: donorId, driveId: id })
        if (!donor) return NextResponse.json({ error: "Donor not found" }, { status: 404 })

        if (status) donor.status = status
        if (bloodGroup) donor.bloodGroup = bloodGroup
        await donor.save()

        const safe = donor.toObject() as any
        delete safe._id
        return NextResponse.json(safe)
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}

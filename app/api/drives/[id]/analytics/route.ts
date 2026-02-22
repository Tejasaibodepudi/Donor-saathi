import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/database/db"
import { BloodDrive, BloodDriveDonor } from "@/database/models"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect()
        await requireAuth(["institution", "blood_bank", "admin"])
        const { id } = await params

        const drive = await BloodDrive.findOne({ id }).lean()
        if (!drive) return NextResponse.json({ error: "Drive not found" }, { status: 404 })

        const allDonors = await BloodDriveDonor.find({ driveId: id }).lean() as any[]

        const totalRegistered = allDonors.length
        const totalDonated = allDonors.filter(d => d.status === "donated").length

        const bloodGroupBreakdown: Record<string, number> = {}
        allDonors.forEach(d => {
            if (d.status === "donated" && d.bloodGroup !== "Unknown") {
                bloodGroupBreakdown[d.bloodGroup] = (bloodGroupBreakdown[d.bloodGroup] || 0) + 1
            }
        })

        return NextResponse.json({
            driveId: id,
            status: drive.status,
            totalRegistered,
            totalDonated,
            attendanceRate: totalRegistered > 0 ? Math.round((totalDonated / totalRegistered) * 100) : 0,
            bloodGroupBreakdown
        })
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}

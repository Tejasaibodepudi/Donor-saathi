import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/database/db"
import { BloodDrive, BloodBank, Institution } from "@/database/models"

function generateId(): string {
    return `drive_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`
}

export async function GET(req: Request) {
    try {
        await dbConnect()
        const auth = await requireAuth(["institution", "blood_bank", "admin"])

        const { searchParams } = new URL(req.url)
        const roleQuery = searchParams.get("role") || auth.role

        let query: any = {}

        if (roleQuery === "institution") query.institutionId = auth.id
        else if (roleQuery === "blood_bank") query.bloodBankId = auth.id
        // admins see all

        const drives = await BloodDrive.find(query).sort({ date: 1 }).lean() as any[]

        // Enrich with names
        const enriched = await Promise.all(drives.map(async (d) => {
            const [bb, inst] = await Promise.all([
                BloodBank.findOne({ id: d.bloodBankId }).select("name").lean() as any,
                Institution.findOne({ id: d.institutionId }).select("name").lean() as any,
            ])
            return {
                ...d,
                bloodBankName: bb?.name || "Unknown Blood Bank",
                institutionName: inst?.name || "Unknown College"
            }
        }))

        return NextResponse.json(enriched)
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect()
        const auth = await requireAuth(["institution"])
        const body = await req.json()

        if (!body.bloodBankId || !body.date || !body.name || !body.estimatedDonors) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const drive = new BloodDrive({
            id: generateId(),
            institutionId: auth.id,
            bloodBankId: body.bloodBankId,
            date: body.date,
            name: body.name,
            estimatedDonors: body.estimatedDonors,
            status: "pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })

        await drive.save()

        const safe = drive.toObject() as any
        delete safe._id
        return NextResponse.json(safe, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized or Invalid Request" }, { status: 400 })
    }
}

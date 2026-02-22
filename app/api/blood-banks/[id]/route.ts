import { NextResponse } from "next/server"
import dbConnect from "@/database/db"
import { BloodBank } from "@/database/models"
import { getAuthToken } from "@/lib/auth"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect()
  const { id } = await params

  const bb = await BloodBank.findOne({ id }).select("-password -_id").lean()
  if (!bb) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json(bb)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect()
  const payload = await getAuthToken()
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const bb = await BloodBank.findOne({ id })
  if (!bb) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const updates = await req.json()

  if (updates.verified !== undefined) {
    bb.status = updates.verified ? "verified" : "pending"
  }

  await bb.save()
  return NextResponse.json({ success: true, status: bb.status })
}

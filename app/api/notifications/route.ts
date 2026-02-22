import { NextResponse } from "next/server"
import dbConnect from "@/database/db"
import { Notification } from "@/database/models"
import { getAuthToken } from "@/lib/auth"

export async function GET() {
  await dbConnect()
  const payload = await getAuthToken()
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userNotifs = await Notification.find({ userId: payload.id })
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json(userNotifs)
}

export async function PATCH(req: Request) {
  await dbConnect()
  const payload = await getAuthToken()
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await req.json()
  const notif = await Notification.findOne({ id })
  if (!notif || notif.userId !== payload.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  notif.read = true
  await notif.save()

  const safe = notif.toObject() as any
  delete safe._id
  return NextResponse.json(safe)
}

import { NextResponse } from "next/server"
import { notifications } from "@/lib/data/store"
import { getAuthToken } from "@/lib/auth"

export async function GET() {
  const payload = await getAuthToken()
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userNotifs = Array.from(notifications.values())
    .filter(n => n.userId === payload.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return NextResponse.json(userNotifs)
}

export async function PATCH(req: Request) {
  const payload = await getAuthToken()
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await req.json()
  const notif = notifications.get(id)
  if (!notif || notif.userId !== payload.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  notif.read = true
  notifications.set(id, notif)
  return NextResponse.json(notif)
}

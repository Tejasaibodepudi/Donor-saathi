import { NextResponse } from "next/server"
import { getAuthToken } from "@/lib/auth"

export async function GET() {
  const payload = await getAuthToken()
  if (!payload) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  return NextResponse.json({
    user: { id: payload.id, name: payload.name, email: payload.email, role: payload.role },
  })
}

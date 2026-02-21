import { NextResponse } from "next/server"
import { donors, bloodBanks, hospitals, admins } from "@/lib/data/store"
import { createToken, setAuthCookie } from "@/lib/auth"
import type { UserRole } from "@/lib/data/types"

export async function POST(req: Request) {
  const { email, password, role } = await req.json() as { email: string; password: string; role: UserRole }

  if (!email || !password || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  let user: { id: string; name: string; email: string; password: string } | undefined

  switch (role) {
    case "donor":
      user = Array.from(donors.values()).find(d => d.email === email)
      break
    case "blood_bank":
      user = Array.from(bloodBanks.values()).find(b => b.email === email)
      break
    case "hospital":
      user = Array.from(hospitals.values()).find(h => h.email === email)
      break
    case "admin":
      user = Array.from(admins.values()).find(a => a.email === email)
      break
  }

  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  }

  const token = createToken({ id: user.id, email: user.email, role, name: user.name })
  await setAuthCookie(token)

  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role },
  })
}

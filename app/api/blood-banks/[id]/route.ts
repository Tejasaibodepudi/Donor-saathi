import { NextResponse } from "next/server"
import { bloodBanks } from "@/lib/data/store"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const bb = bloodBanks.get(id)
  if (!bb) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const { password: _, ...safe } = bb
  return NextResponse.json(safe)
}

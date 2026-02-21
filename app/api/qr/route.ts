import { NextRequest, NextResponse } from "next/server"
import QRCode from "qrcode"

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")
  if (!code) {
    return NextResponse.json({ error: "Missing code parameter" }, { status: 400 })
  }

  try {
    const dataUrl = await QRCode.toDataURL(code, {
      width: 300,
      margin: 2,
      color: {
        dark: "#1a1a1a",
        light: "#ffffff",
      },
    })
    return NextResponse.json({ qr: dataUrl })
  } catch {
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 })
  }
}

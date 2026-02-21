"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface QRDisplayProps {
  value: string
  title?: string
  subtitle?: string
  size?: number
}

export function QRDisplay({ value, title, subtitle, size = 200 }: QRDisplayProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  useEffect(() => {
    async function generateQR() {
      try {
        const res = await fetch(`/api/qr?code=${encodeURIComponent(value)}`)
        const data = await res.json()
        if (data.qr) {
          setQrDataUrl(data.qr)
        }
      } catch {
        setQrDataUrl(null)
      }
    }
    generateQR()
  }, [value, size])

  return (
    <Card className="w-fit">
      <CardHeader className="pb-2 text-center">
        {title && <CardTitle className="text-lg">{title}</CardTitle>}
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3 pb-5">
        <div className="rounded-lg border bg-white p-3">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt={`QR Code for ${value}`} width={size} height={size} />
          ) : (
            <div style={{ width: size, height: size }} className="flex items-center justify-center bg-muted rounded">
              <span className="text-xs text-muted-foreground">Generating...</span>
            </div>
          )}
        </div>
        <code className="rounded bg-muted px-3 py-1.5 text-sm font-mono">{value}</code>
      </CardContent>
    </Card>
  )
}

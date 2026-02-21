"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScanLine, Search, Loader2 } from "lucide-react"

interface QRScannerProps {
  onScan: (code: string) => Promise<void>
  isLoading?: boolean
}

export function QRScanner({ onScan, isLoading }: QRScannerProps) {
  const [code, setCode] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim()) {
      await onScan(code.trim())
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ScanLine className="h-5 w-5 text-primary" />
          Scan QR Code
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mx-auto mb-6 max-w-xs">
          <div className="relative aspect-square rounded-xl border-2 border-dashed border-primary/30 bg-muted/30 flex flex-col items-center justify-center gap-3 p-6">
            <div className="absolute inset-4 border-2 border-primary/20 rounded-lg" />
            <div className="absolute top-4 left-4 h-6 w-6 border-t-2 border-l-2 border-primary rounded-tl" />
            <div className="absolute top-4 right-4 h-6 w-6 border-t-2 border-r-2 border-primary rounded-tr" />
            <div className="absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-primary rounded-bl" />
            <div className="absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-primary rounded-br" />
            <ScanLine className="h-10 w-10 text-primary/40" />
            <p className="text-xs text-muted-foreground text-center">Camera scanning simulated. Enter code below.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Enter appointment QR code (e.g. BSN-APT1-2026)"
            className="flex-1"
          />
          <Button type="submit" disabled={!code.trim() || isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Verify
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

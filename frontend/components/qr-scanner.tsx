"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScanLine, Search, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import dynamic from "next/dynamic"

const Scanner = dynamic(() => import('@yudiel/react-qr-scanner').then((mod) => mod.Scanner), { ssr: false, loading: () => <div className="flex flex-col items-center justify-center h-full text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin mb-2" /><span>Loading Scanner...</span></div> })

interface QRScannerProps {
  onScan: (code: string) => Promise<void>
  isLoading?: boolean
}

export function QRScanner({ onScan, isLoading }: QRScannerProps) {
  const [code, setCode] = useState("")
  const [cameraError, setCameraError] = useState(false)

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
        {cameraError && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Camera access requires HTTPS. For local development, use <code className="text-xs bg-muted px-1 py-0.5 rounded">localhost</code> instead of IP address, or manually enter the QR code below.
            </AlertDescription>
          </Alert>
        )}
        <div className="mx-auto mb-6 max-w-sm rounded-xl overflow-hidden border-2 border-primary/20 bg-black min-h-[300px] flex items-center justify-center relative">
          <Scanner
            constraints={{
              facingMode: "environment",
              aspectRatio: 1
            }}
            allowMultiple={false}
            onScan={(result) => {
              if (result && result.length > 0) {
                const scannedCode = result[0].rawValue;
                if (scannedCode && scannedCode !== code) {
                  setCode(scannedCode);
                  setCameraError(false);
                  if (!isLoading) {
                    onScan(scannedCode);
                  }
                }
              }
            }}
            onError={(error) => {
              console.error("QR Scan Error:", error)
              setCameraError(true)
            }}
            components={{
              finder: true
            }}
            styles={{
              container: { width: "100%", height: "100%" }
            }}
          />
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

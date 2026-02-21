"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { QRScanner } from "@/components/qr-scanner"
import { BloodGroupBadge } from "@/components/blood-group-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Calendar, Shield, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface ScanResult {
  appointment: { id: string; status: string; qrCode: string }
  donor: { id: string; name: string; bloodGroup: string; phone: string; trustScore: number } | null
  slot: { date: string; startTime: string; endTime: string } | null
}

export default function BloodBankScan() {
  const [result, setResult] = useState<ScanResult | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  const handleScan = async (code: string) => {
    setIsScanning(true)
    const res = await fetch("/api/appointments/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qrCode: code }),
    })
    setIsScanning(false)

    if (res.ok) {
      const data = await res.json()
      setResult(data)
      toast.success("QR code verified!")
    } else {
      const err = await res.json()
      toast.error(err.error || "Invalid QR code")
      setResult(null)
    }
  }

  const handleCheckIn = async () => {
    if (!result?.appointment) return
    const res = await fetch(`/api/appointments/${result.appointment.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "check_in" }),
    })
    if (res.ok) {
      toast.success("Donor checked in successfully!")
      setResult(prev => prev ? { ...prev, appointment: { ...prev.appointment, status: "checked_in" } } : null)
    }
  }

  const handleComplete = async () => {
    if (!result?.appointment) return
    const res = await fetch(`/api/appointments/${result.appointment.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete" }),
    })
    if (res.ok) {
      toast.success("Donation marked as complete!")
      setResult(prev => prev ? { ...prev, appointment: { ...prev.appointment, status: "completed" } } : null)
    }
  }

  return (
    <>
      <DashboardHeader title="QR Scanner" subtitle="Verify and check in donors" />
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <QRScanner onScan={handleScan} isLoading={isScanning} />

          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  Verification Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Donor Info */}
                {result.donor && (
                  <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{result.donor.name}</p>
                        <p className="text-xs text-muted-foreground">{result.donor.phone}</p>
                      </div>
                      <BloodGroupBadge group={result.donor.bloodGroup} className="ml-auto" />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span>Trust Score: {result.donor.trustScore}/100</span>
                    </div>
                  </div>
                )}

                {/* Slot Info */}
                {result.slot && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{result.slot.date} | {result.slot.startTime} - {result.slot.endTime}</span>
                  </div>
                )}

                {/* Status and Actions */}
                <div className="flex items-center justify-between">
                  <Badge variant={
                    result.appointment.status === "completed" ? "default" :
                    result.appointment.status === "checked_in" ? "secondary" : "outline"
                  }>
                    {result.appointment.status.replace("_", " ")}
                  </Badge>
                  <div className="flex gap-2">
                    {result.appointment.status === "booked" && (
                      <Button size="sm" onClick={handleCheckIn}>Check In</Button>
                    )}
                    {result.appointment.status === "checked_in" && (
                      <Button size="sm" onClick={handleComplete}>Complete Donation</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

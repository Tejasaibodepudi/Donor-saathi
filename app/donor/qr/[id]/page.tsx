"use client"

import { use } from "react"
import useSWR from "swr"
import { DashboardHeader } from "@/components/dashboard-header"
import { QRDisplay } from "@/components/qr-display"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function DonorQRPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: appointment } = useSWR(`/api/appointments/${id}`, fetcher)

  return (
    <>
      <DashboardHeader title="Appointment QR Code" subtitle="Show this code at the blood bank" />
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-md space-y-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/donor/appointments">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Appointments
            </Link>
          </Button>

          {appointment?.qrCode ? (
            <div className="flex justify-center">
              <QRDisplay
                value={appointment.qrCode}
                title="Donation Appointment"
                subtitle="Present this QR code at the blood bank for check-in"
                size={250}
              />
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-sm text-muted-foreground">Loading appointment details...</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

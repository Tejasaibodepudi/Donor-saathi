"use client"

import { useState } from "react"
import useSWR from "swr"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Clock, MapPin, Calendar, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const fetcher = (url: string) => fetch(url).then(r => r.json())

interface BloodBankData {
  id: string
  name: string
  address: string
  city: string
  operatingHours: string
  status: string
}

interface SlotData {
  id: string
  bloodBankId: string
  date: string
  startTime: string
  endTime: string
  capacity: number
  booked: number
}

export default function BookDonation() {
  const { data: bloodBanks } = useSWR<BloodBankData[]>("/api/blood-banks", fetcher)
  const [selectedBB, setSelectedBB] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const { data: slots } = useSWR<SlotData[]>(
    selectedBB ? `/api/blood-banks/slots?bloodBankId=${selectedBB}&date=${selectedDate}` : null,
    fetcher
  )
  const [booking, setBooking] = useState<string | null>(null)
  const router = useRouter()

  const verifiedBBs = bloodBanks?.filter(bb => bb.status === "verified") || []

  const bookSlot = async (slotId: string) => {
    setBooking(slotId)
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotId, bloodBankId: selectedBB }),
    })
    setBooking(null)
    if (res.ok) {
      toast.success("Appointment booked!")
      router.push("/donor/appointments")
    } else {
      const err = await res.json()
      toast.error(err.error || "Failed to book")
    }
  }

  // Generate date options for next 7 days
  const dateOptions: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    dateOptions.push(d.toISOString().split("T")[0])
  }

  return (
    <>
      <DashboardHeader title="Book Donation" subtitle="Choose a blood bank and time slot" />
      <div className="flex-1 p-6">
        <div className="space-y-6">
          {/* Step 1: Choose Blood Bank */}
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Step 1: Select Blood Bank</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {verifiedBBs.map(bb => (
                <Card
                  key={bb.id}
                  className={`cursor-pointer transition-all ${selectedBB === bb.id ? "ring-2 ring-primary" : "hover:shadow-md"}`}
                  onClick={() => setSelectedBB(bb.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{bb.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />{bb.city}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" />{bb.operatingHours}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Step 2: Choose Date & Slot */}
          {selectedBB && (
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-3">Step 2: Select Date</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {dateOptions.map(d => (
                  <Button
                    key={d}
                    variant={selectedDate === d ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDate(d)}
                  >
                    <Calendar className="mr-1 h-3 w-3" />
                    {new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </Button>
                ))}
              </div>

              <h2 className="text-sm font-medium text-muted-foreground mb-3">Step 3: Select Time Slot</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {slots && slots.length > 0 ? (
                  slots.map(slot => {
                    const available = slot.capacity - slot.booked
                    const isFull = available <= 0
                    return (
                      <Card key={slot.id} className={isFull ? "opacity-50" : ""}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-primary" />
                              <span className="font-medium text-sm">{slot.startTime} - {slot.endTime}</span>
                            </div>
                            <Badge variant={isFull ? "secondary" : "default"}>
                              {available} left
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            className="w-full mt-2"
                            disabled={isFull || booking === slot.id}
                            onClick={() => bookSlot(slot.id)}
                          >
                            {booking === slot.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Book This Slot"}
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })
                ) : (
                  <Card className="col-span-full">
                    <CardContent className="p-8 text-center">
                      <p className="text-sm text-muted-foreground">No available slots for this date</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

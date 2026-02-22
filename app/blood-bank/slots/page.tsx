"use client"

import { useState } from "react"
import useSWR from "swr"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Plus, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"

const fetcher = (url: string) => fetch(url).then(r => r.json())

interface SlotData {
  id: string
  date: string
  startTime: string
  endTime: string
  capacity: number
  booked: number
  isActive: boolean
}

export default function BloodBankSlots() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const { data: slots, mutate } = useSWR<SlotData[]>(
    user ? `/api/blood-banks/slots?bloodBankId=${user.id}&date=${selectedDate}` : null,
    fetcher,
    { refreshInterval: 5000 }
  )
  const [creating, setCreating] = useState(false)
  const [newSlot, setNewSlot] = useState({ date: "", startTime: "09:00", endTime: "10:00", capacity: "5" })
  const [open, setOpen] = useState(false)

  const createSlot = async () => {
    setCreating(true)
    const res = await fetch("/api/blood-banks/slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newSlot, capacity: parseInt(newSlot.capacity) }),
    })
    setCreating(false)
    if (res.ok) {
      toast.success("Slot created")
      mutate()
      setOpen(false)
    } else {
      toast.error("Failed to create slot")
    }
  }

  const deleteSlot = async (id: string) => {
    const res = await fetch(`/api/blood-banks/slots/${id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("Slot deleted")
      mutate()
    }
  }

  const dateOptions: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    dateOptions.push(d.toISOString().split("T")[0])
  }

  return (
    <>
      <DashboardHeader title="Manage Slots" subtitle="Create and manage donation time slots" />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {dateOptions.map(d => (
              <Button
                key={d}
                variant={selectedDate === d ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDate(d)}
              >
                {new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </Button>
            ))}
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Slot
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Slot</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={newSlot.date} onChange={e => setNewSlot(s => ({ ...s, date: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input type="time" value={newSlot.startTime} onChange={e => setNewSlot(s => ({ ...s, startTime: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input type="time" value={newSlot.endTime} onChange={e => setNewSlot(s => ({ ...s, endTime: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Capacity</Label>
                  <Input type="number" value={newSlot.capacity} onChange={e => setNewSlot(s => ({ ...s, capacity: e.target.value }))} min="1" />
                </div>
                <Button onClick={createSlot} disabled={creating} className="w-full">
                  {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  Create Slot
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {slots && slots.length > 0 ? (
            slots.map(slot => (
              <Card key={slot.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">{slot.startTime} - {slot.endTime}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteSlot(slot.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Capacity: {slot.capacity}</span>
                    <Badge variant={slot.booked >= slot.capacity ? "destructive" : "secondary"}>
                      {slot.booked}/{slot.capacity} booked
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="p-8 text-center">
                <Calendar className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No slots for this date</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

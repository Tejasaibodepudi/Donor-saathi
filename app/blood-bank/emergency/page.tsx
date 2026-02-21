"use client"

import { useState } from "react"
import useSWR from "swr"
import { DashboardHeader } from "@/components/dashboard-header"
import { EmergencyAlertCard } from "@/components/emergency-alert-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import type { EmergencyRequest } from "@/lib/data/types"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function BloodBankEmergency() {
  const { data: emergencies, mutate } = useSWR<EmergencyRequest[]>("/api/emergency", fetcher)
  const [creating, setCreating] = useState(false)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    bloodGroup: "O+", unitsNeeded: "3", priority: "urgent",
    reason: "", contactPhone: "", hospital: "",
  })

  const createEmergency = async () => {
    setCreating(true)
    const res = await fetch("/api/emergency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        unitsNeeded: parseInt(form.unitsNeeded),
      }),
    })
    setCreating(false)
    if (res.ok) {
      toast.success("Emergency request broadcasted!")
      mutate()
      setOpen(false)
    } else {
      toast.error("Failed to create request")
    }
  }

  return (
    <>
      <DashboardHeader title="Emergency Requests" subtitle="Create and monitor emergency blood requests" />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">Active Emergency Requests</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create Emergency
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Broadcast Emergency Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Blood Group</Label>
                    <Select value={form.bloodGroup} onValueChange={v => setForm(f => ({ ...f, bloodGroup: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Units Needed</Label>
                    <Input type="number" value={form.unitsNeeded} onChange={e => setForm(f => ({ ...f, unitsNeeded: e.target.value }))} min="1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Textarea value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} placeholder="Describe the emergency" />
                </div>
                <div className="space-y-2">
                  <Label>Contact Phone</Label>
                  <Input value={form.contactPhone} onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))} />
                </div>
                <Button onClick={createEmergency} disabled={creating} className="w-full">
                  {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
                  Broadcast Emergency
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {emergencies && emergencies.length > 0 ? (
            emergencies.map(e => <EmergencyAlertCard key={e.id} emergency={e} />)
          ) : (
            <Card className="col-span-full">
              <CardContent className="p-8 text-center">
                <AlertTriangle className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No emergency requests</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

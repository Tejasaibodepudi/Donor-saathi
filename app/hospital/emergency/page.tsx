"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { EmergencyAlertCard } from "@/components/emergency-alert-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertTriangle, Plus } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import type { EmergencyRequest } from "@/lib/data/types"
import { toast } from "sonner"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(r => r.json())
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

export default function HospitalEmergencyPage() {
  const { user } = useAuth()
  const { data: emergencies, mutate } = useSWR<EmergencyRequest[]>("/api/emergency", fetcher)
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ bloodGroup: "", units: "", message: "", contactPhone: "" })

  const myEmergencies = emergencies?.filter(
    (e) => e.requesterId === user?.id
  ) || []

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/api/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bloodGroup: form.bloodGroup,
          unitsNeeded: parseInt(form.units),
          hospital: user?.name || "Unknown Hospital",
          reason: form.message,
          contactPhone: form.contactPhone,
        }),
      })
      if (!res.ok) throw new Error("Failed to create request")
      toast.success("Emergency request created and broadcast to matching donors.")
      setOpen(false)
      setForm({ bloodGroup: "", units: "", message: "", contactPhone: "" })
      mutate()
    } catch {
      toast.error("Failed to create emergency request.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader title="Emergency Requests" subtitle="Create and manage emergency blood requests">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <Plus className="mr-2 h-4 w-4" />
              New Emergency Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Create Emergency Request
              </DialogTitle>
              <DialogDescription>
                This will broadcast an urgent notification to all matching donors in the network.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Blood Group Required</label>
                <Select value={form.bloodGroup} onValueChange={(v) => setForm(prev => ({ ...prev, bloodGroup: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Units Needed</label>
                <Input
                  type="number"
                  min="1"
                  value={form.units}
                  onChange={(e) => setForm(prev => ({ ...prev, units: e.target.value }))}
                  placeholder="Number of units"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Contact Phone</label>
                <Input
                  type="tel"
                  value={form.contactPhone}
                  onChange={(e) => setForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Details</label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Describe the emergency situation..."
                  rows={3}
                />
              </div>
              <Button type="submit" variant="destructive" className="w-full" disabled={submitting || !form.bloodGroup || !form.units}>
                {submitting ? "Broadcasting..." : "Create Emergency Request"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </DashboardHeader>
      <div className="flex-1 p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>My Emergency Requests</CardTitle>
              <CardDescription>Requests created by your hospital</CardDescription>
            </CardHeader>
            <CardContent>
              {myEmergencies.length === 0 ? (
                <p className="text-sm text-muted-foreground">No emergency requests created yet.</p>
              ) : (
                <div className="space-y-3">
                  {myEmergencies.map((e) => (
                    <EmergencyAlertCard key={e.id} emergency={e} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Network Emergencies</CardTitle>
              <CardDescription>Active requests across the network</CardDescription>
            </CardHeader>
            <CardContent>
              {!emergencies || emergencies.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active emergencies in the network.</p>
              ) : (
                <div className="space-y-3">
                  {emergencies.filter((e) => e.status === "active").map((e) => (
                    <EmergencyAlertCard key={e.id} emergency={e} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

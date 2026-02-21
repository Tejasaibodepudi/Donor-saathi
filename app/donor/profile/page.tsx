"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BloodGroupBadge } from "@/components/blood-group-badge"
import { Loader2, Save, User } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function DonorProfile() {
  const { user } = useAuth()
  const { data: donors, mutate } = useSWR("/api/donors", fetcher)
  const donor = donors?.find((d: { email: string }) => d.email === user?.email)

  const [form, setForm] = useState({
    name: "", phone: "", bloodGroup: "O+", gender: "male",
    dateOfBirth: "", address: "", city: "", state: "",
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (donor) {
      setForm({
        name: donor.name, phone: donor.phone, bloodGroup: donor.bloodGroup,
        gender: donor.gender, dateOfBirth: donor.dateOfBirth,
        address: donor.address, city: donor.city, state: donor.state,
      })
    }
  }, [donor])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch("/api/donors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setSaving(false)
    if (res.ok) {
      toast.success("Profile updated")
      mutate()
    } else {
      toast.error("Failed to update profile")
    }
  }

  return (
    <>
      <DashboardHeader title="Profile" subtitle="Update your personal information" />
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Profile Summary */}
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{donor?.name || "Loading..."}</h2>
                <p className="text-sm text-muted-foreground">{donor?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <BloodGroupBadge group={donor?.bloodGroup || "O+"} />
                  <span className="text-xs text-muted-foreground">Trust Score: {donor?.trustScore || 0}/100</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
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
                    <Label>Gender</Label>
                    <Select value={form.gender} onValueChange={v => setForm(f => ({ ...f, gender: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input type="date" value={form.dateOfBirth} onChange={e => setForm(f => ({ ...f, dateOfBirth: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Address</Label>
                    <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                  </div>
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

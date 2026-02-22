"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Loader2, Hospital } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function ScheduleDrive() {
    const router = useRouter()
    const { data: bloodBanks, isLoading } = useSWR<any[]>("/api/blood-banks", fetcher)

    const [form, setForm] = useState({
        name: "",
        date: "",
        bloodBankId: "",
        estimatedDonors: "50"
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const res = await fetch("/api/drives", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    estimatedDonors: parseInt(form.estimatedDonors)
                })
            })

            if (!res.ok) throw new Error("Failed to request drive")

            toast.success("Blood drive requested! Waiting for blood bank approval.")
            router.push("/institution/dashboard")
        } catch {
            toast.error("An error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-1 flex-col">
            <DashboardHeader title="Schedule a Blood Drive" subtitle="Partner with a local blood bank for your event" />
            <div className="flex-1 p-6 max-w-3xl mx-auto w-full">
                <Card>
                    <CardHeader>
                        <CardTitle>Event Details</CardTitle>
                        <CardDescription>Fill out the expected details of your college / corporate blood drive.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="space-y-2">
                                <Label>Event Name</Label>
                                <Input
                                    required
                                    placeholder="e.g. SRM University Annual Blood Drive 2026"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Proposed Date</Label>
                                    <div className="relative">
                                        <Input
                                            required
                                            type="date"
                                            value={form.date}
                                            className="pl-10"
                                            onChange={e => setForm({ ...form, date: e.target.value })}
                                        />
                                        <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Expected Participants</Label>
                                    <Input
                                        required
                                        type="number"
                                        min="10"
                                        max="5000"
                                        placeholder="50"
                                        value={form.estimatedDonors}
                                        onChange={e => setForm({ ...form, estimatedDonors: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Partner Blood Bank</Label>
                                <Select required value={form.bloodBankId} onValueChange={v => setForm({ ...form, bloodBankId: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a verified blood bank to invite..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {isLoading ? (
                                            <SelectItem disabled value="loading">Loading blood banks...</SelectItem>
                                        ) : (
                                            bloodBanks?.map(bb => (
                                                <SelectItem key={bb.id} value={bb.id}>
                                                    <div className="flex items-center gap-2">
                                                        <Hospital className="h-4 w-4 text-rose-500" />
                                                        <span>{bb.name}</span>
                                                        <span className="text-muted-foreground text-xs ml-2">({bb.city})</span>
                                                    </div>
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1">The requested blood bank must approve this drive before it becomes active.</p>
                            </div>

                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Drive Request
                            </Button>

                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

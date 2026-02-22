"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Droplet, Plus, Loader2, CheckCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useParams } from "next/navigation"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(r => r.json())
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"]

export default function DriveTerminal() {
    const { id } = useParams<{ id: string }>()
    const { data: analytics, mutate: mutateAnalytics } = useSWR(`/api/drives/${id}/analytics`, fetcher, { refreshInterval: 5000 })
    const { data: donors, mutate: mutateDonors } = useSWR(`/api/drives/${id}/donors`, fetcher, { refreshInterval: 5000 })

    const [newDonorName, setNewDonorName] = useState("")
    const [newDonorBg, setNewDonorBg] = useState("Unknown")
    const [isAdding, setIsAdding] = useState(false)

    if (!analytics || !donors) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    const handleAddDonor = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newDonorName) return
        setIsAdding(true)

        try {
            const res = await fetch(`/api/drives/${id}/donors`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newDonorName, bloodGroup: newDonorBg })
            })
            if (!res.ok) throw new Error("Failed to add")
            setNewDonorName("")
            setNewDonorBg("Unknown")
            toast.success("Donor registered!")
            mutateDonors()
            mutateAnalytics()
        } catch {
            toast.error("Error adding donor")
        } finally {
            setIsAdding(false)
        }
    }

    const markDonated = async (donorId: string, bg: string) => {
        try {
            const res = await fetch(`/api/drives/${id}/donors`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ donorId, status: "donated", bloodGroup: bg })
            })
            if (!res.ok) throw new Error("Failed")
            toast.success("Attendance logged")
            mutateDonors()
            mutateAnalytics()
        } catch {
            toast.error("Failed to update status")
        }
    }

    return (
        <div className="flex flex-1 flex-col pb-10">
            <DashboardHeader title="Live Drive Terminal" subtitle="Manage walk-ins and track donation metrics in real-time" />
            <div className="flex-1 p-6 space-y-6">

                {/* Live Metrics Row */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="bg-blue-50/50 border-blue-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-800">Drive Status</CardTitle>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 capitalize">{analytics.status}</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-900">{analytics.status === 'approved' ? 'Active' : analytics.status}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Registered</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.totalRegistered}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-green-200 bg-green-50/30">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-green-800">Units Collected</CardTitle>
                            <Droplet className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-700">{analytics.totalDonated}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Turnout Rate</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.attendanceRate}%</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Walk in Registration Form */}
                    <Card className="lg:col-span-1 h-fit">
                        <CardHeader>
                            <CardTitle>Walk-in Registration</CardTitle>
                            <CardDescription>Rapidly log new donors as they arrive</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddDonor} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Donor Name</Label>
                                    <Input required placeholder="Enter full name" value={newDonorName} onChange={e => setNewDonorName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Blood Group (If Known)</Label>
                                    <Select value={newDonorBg} onValueChange={setNewDonorBg}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {bloodGroups.map(bg => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit" disabled={isAdding}>
                                    {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                    Register Walk-in
                                </Button>
                            </form>

                            {/* Quick Analytics Breakdown */}
                            <div className="mt-8 pt-6 border-t">
                                <h4 className="font-semibold text-sm mb-4">Collection Breakdown</h4>
                                <div className="space-y-2">
                                    {Object.entries(analytics.bloodGroupBreakdown || {}).map(([bg, count]) => (
                                        <div key={bg} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                                <span className="font-medium text-slate-700">{bg}</span>
                                            </div>
                                            <span className="font-semibold text-red-600">{count as React.ReactNode} Units</span>
                                        </div>
                                    ))}
                                    {Object.keys(analytics.bloodGroupBreakdown || {}).length === 0 && (
                                        <p className="text-muted-foreground text-sm text-center py-2">No units collected yet</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attendance Engine */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Attendance & Vitals Ledger</CardTitle>
                            <CardDescription>Mark donors as 'Donated' the moment a unit is drawn.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border h-[500px] overflow-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50 sticky top-0">
                                        <TableRow>
                                            <TableHead>Donor Name</TableHead>
                                            <TableHead>Group</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {donors.map((d: any) => (
                                            <TableRow key={d.id}>
                                                <TableCell className="font-medium">{d.name}</TableCell>
                                                <TableCell>{d.bloodGroup}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={d.status === "donated" ? "bg-green-100 text-green-800 border-green-200" : "bg-slate-100"}>
                                                        {d.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {d.status === "registered" ? (
                                                        <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 text-xs" onClick={() => markDonated(d.id, d.bloodGroup)}>
                                                            <CheckCircle className="mr-1 h-3 w-3" /> Mark Donated
                                                        </Button>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">Logged</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}

"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, CalendarRange, Users, Loader2, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function BloodBankDrivesRequests() {
    const { data: drives, error, mutate } = useSWR<any[]>("/api/drives", fetcher, { refreshInterval: 5000 })

    if (error) return <div className="p-8 text-destructive">Failed to load requests.</div>

    if (!drives) return (
        <div className="flex h-[50vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    )

    const pending = drives.filter(d => d.status === "pending")
    const active = drives.filter(d => d.status === "approved" || d.status === "completed")

    const handleAction = async (id: string, action: "approved" | "declined") => {
        try {
            const res = await fetch(`/api/drives/${id}/respond`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: action }),
            })
            if (!res.ok) throw new Error("Failed to process action")

            toast.success(`Drive request ${action}!`)
            mutate()
        } catch {
            toast.error("An error occurred processing the request")
        }
    }

    return (
        <div className="flex flex-1 flex-col">
            <DashboardHeader title="Institutional Drive Requests" subtitle="Review and approve incoming Blood Drive proposals from local Colleges and Corporations" />
            <div className="flex-1 p-6 space-y-8">

                <section>
                    <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
                        Pending Approval
                        {pending.length > 0 && <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-800 text-xs">{pending.length}</span>}
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {pending.length === 0 ? (
                            <Card className="col-span-full border-dashed">
                                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                                    <Building2 className="h-10 w-10 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground font-medium">No new incoming drive requests.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            pending.map(drive => (
                                <Card key={drive.id} className="relative overflow-hidden transition-all hover:shadow-md border-amber-200 bg-amber-50/10">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                                URGENT REVIEW
                                            </Badge>
                                            <span className="text-sm font-semibold flex items-center text-amber-900"><CalendarRange className="mr-1 h-3 w-3" /> {drive.date}</span>
                                        </div>
                                        <CardTitle className="mt-2 text-lg">{drive.name}</CardTitle>
                                        <CardDescription className="font-medium text-slate-700">{drive.institutionName}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-4 text-sm text-slate-600 mb-6 bg-white p-3 rounded-md border">
                                            <span className="flex flex-col items-center flex-1">
                                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Expected Capacity</span>
                                                <span className="flex items-center text-lg font-bold text-slate-800"><Users className="mr-2 h-5 w-5 text-blue-500" /> {drive.estimatedDonors}</span>
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleAction(drive.id, "approved")}
                                                className="flex-1 bg-green-600 hover:bg-green-700"
                                            >
                                                <CheckCircle className="mr-2 h-4 w-4" /> Accept
                                            </Button>
                                            <Button
                                                onClick={() => handleAction(drive.id, "declined")}
                                                variant="destructive"
                                                className="flex-1"
                                            >
                                                <XCircle className="mr-2 h-4 w-4" /> Decline
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </section>


                <section>
                    <h2 className="text-xl font-bold tracking-tight mb-4 text-slate-800">Your Approved Drives</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {active.length === 0 ? (
                            <p className="text-muted-foreground">You have no active drives scheduled.</p>
                        ) : (
                            active.map(drive => (
                                <Card key={drive.id} className="opacity-90">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="outline" className={drive.status === 'completed' ? 'bg-slate-100' : 'bg-green-100 text-green-800 border-green-200'}>
                                                {drive.status.toUpperCase()}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground flex items-center"><CalendarRange className="mr-1 h-3 w-3" /> {drive.date}</span>
                                        </div>
                                        <CardTitle className="mt-2 text-md">{drive.name}</CardTitle>
                                        <CardDescription>{drive.institutionName}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))
                        )}
                    </div>
                </section>

            </div>
        </div>
    )
}

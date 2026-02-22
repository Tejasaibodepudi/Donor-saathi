"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarRange, Activity, Loader2, Plus, Users, Droplets } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function InstitutionDashboard() {
    const { data: drives, error } = useSWR<any[]>("/api/drives", fetcher, { refreshInterval: 5000 })

    if (error) return <div className="p-8 text-destructive">Failed to load dashboard data.</div>

    if (!drives) return (
        <div className="flex h-[50vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    )

    const active = drives.filter(d => d.status === "approved" || d.status === "pending")
    const past = drives.filter(d => d.status === "completed")

    return (
        <div className="flex flex-1 flex-col">
            <DashboardHeader title="Institution Portal" subtitle="Manage Corporate and College Blood Drives" />
            <div className="flex-1 p-6 space-y-6">

                {/* Quick Actions */}
                <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                    <div>
                        <h3 className="font-semibold text-lg text-slate-800">Organize a New Drive</h3>
                        <p className="text-sm text-slate-500">Partner with local blood banks to host a donation event.</p>
                    </div>
                    <Link href="/institution/drives/schedule">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" /> Request Blood Drive
                        </Button>
                    </Link>
                </div>

                {/* Current & Upcoming Drives */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold tracking-tight">Active Campaigns</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {active.length === 0 ? (
                            <Card className="col-span-full border-dashed">
                                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                                    <CalendarRange className="h-10 w-10 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground font-medium">No active blood drives scheduled.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            active.map(drive => (
                                <Card key={drive.id} className="relative overflow-hidden transition-all hover:shadow-md border-blue-100">
                                    <div className={`absolute top-0 left-0 w-1 h-full ${drive.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <Badge variant={drive.status === "approved" ? "default" : "secondary"} className={drive.status === "approved" ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"}>
                                                {drive.status.toUpperCase()}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground flex items-center"><CalendarRange className="mr-1 h-3 w-3" /> {drive.date}</span>
                                        </div>
                                        <CardTitle className="mt-2 text-lg">{drive.name}</CardTitle>
                                        <CardDescription>Partner: {drive.bloodBankName}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                            <span className="flex items-center"><Users className="mr-1 h-4 w-4" /> {drive.estimatedDonors} expected</span>
                                        </div>
                                        {drive.status === "approved" ? (
                                            <Link href={`/institution/drives/${drive.id}`}>
                                                <Button variant="outline" className="w-full justify-between group">
                                                    Manage Event Attendance <Activity className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Button disabled variant="secondary" className="w-full">
                                                Awaiting Bank Approval
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Clock } from "lucide-react"
import useSWR from "swr"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function HistoryPage() {
    const { data: drives, error } = useSWR<any[]>("/api/drives", fetcher)

    if (error) return <div className="p-8 text-destructive">Failed to load history.</div>
    if (!drives) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>

    const pastDrives = drives.filter(d => ["completed", "cancelled", "declined"].includes(d.status))

    return (
        <div className="flex flex-1 flex-col">
            <DashboardHeader title="Drive History" subtitle="Review past blood donation events" />
            <div className="flex-1 p-6 space-y-6">

                <Card>
                    <CardHeader>
                        <CardTitle>Past Events</CardTitle>
                        <CardDescription>A complete log of all concluded blood drives.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Event Name</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Partner Blood Bank</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pastDrives.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2">
                                                <Clock className="h-8 w-8 text-slate-300" />
                                                <p>No past drive history found.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pastDrives.map(drive => (
                                        <TableRow key={drive.id}>
                                            <TableCell className="font-medium text-slate-700">{drive.name}</TableCell>
                                            <TableCell>{drive.date}</TableCell>
                                            <TableCell>{drive.bloodBankName}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={
                                                    drive.status === 'completed' ? 'bg-slate-100 text-slate-700' :
                                                        'bg-red-50 text-red-700'
                                                }>
                                                    {drive.status.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}

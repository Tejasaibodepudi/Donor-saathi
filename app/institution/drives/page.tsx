"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarRange, Plus, Loader2 } from "lucide-react"
import Link from "next/link"
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

export default function ManageDrivesPage() {
    const { data: drives, error } = useSWR<any[]>("/api/drives", fetcher)

    if (error) return <div className="p-8 text-destructive">Failed to load drives.</div>
    if (!drives) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>

    return (
        <div className="flex flex-1 flex-col">
            <DashboardHeader title="Manage Blood Drives" subtitle="View and manage all your institutional blood drives" />
            <div className="flex-1 p-6 space-y-6">

                <div className="flex justify-end">
                    <Link href="/institution/drives/schedule">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" /> Schedule New Drive
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Drives</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Event Name</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Partner Blood Bank</TableHead>
                                    <TableHead>Expected Donors</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {drives.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No blood drives found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    drives.map(drive => (
                                        <TableRow key={drive.id}>
                                            <TableCell className="font-medium">{drive.name}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <CalendarRange className="mr-2 h-4 w-4 text-muted-foreground" />
                                                    {drive.date}
                                                </div>
                                            </TableCell>
                                            <TableCell>{drive.bloodBankName}</TableCell>
                                            <TableCell>{drive.estimatedDonors}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={
                                                    drive.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        drive.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            drive.status === 'declined' ? 'bg-red-100 text-red-800' : 'bg-slate-100'
                                                }>
                                                    {drive.status.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {drive.status === "approved" && (
                                                    <Link href={`/institution/drives/${drive.id}`}>
                                                        <Button size="sm" variant="outline">Manage Event</Button>
                                                    </Link>
                                                )}
                                                {drive.status === "pending" && (
                                                    <span className="text-xs text-muted-foreground">Awaiting Approval</span>
                                                )}
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

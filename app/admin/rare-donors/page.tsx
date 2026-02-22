"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, ShieldAlert, Check, X, FileText } from "lucide-react"
import { toast } from "sonner"
import useSWR from "swr"
import type { RareDonorProfile, AdminAuditLog } from "@/lib/data/types"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function AdminRareDonorsPage() {
    const { data: rareData, mutate: mutateProfiles } = useSWR("/api/admin/rare-donors", fetcher)
    const { data: auditData, mutate: mutateLogs } = useSWR("/api/admin/audit-logs", fetcher)

    const profiles: (RareDonorProfile & { donorName?: string, donorEmail?: string })[] = rareData?.profiles || []
    const logs: AdminAuditLog[] = auditData?.logs || []

    const handleVerify = async (profileId: string, status: "VERIFIED" | "REJECTED") => {
        try {
            const res = await fetch("/api/admin/rare-donors", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profileId, status })
            })

            if (res.ok) {
                toast.success(`Profile marked as ${status}`)
                mutateProfiles()
                mutateLogs()
            } else {
                toast.error("Failed to update status")
            }
        } catch (err) {
            toast.error("Network error")
        }
    }

    const pendingProfiles = profiles.filter(p => p.verificationStatus === "PENDING")
    const verifiedProfiles = profiles.filter(p => p.verificationStatus === "VERIFIED")

    return (
        <div className="flex flex-1 flex-col">
            <DashboardHeader
                title="Rare Donor Registry Administration"
                subtitle="Verification, oversight, and strict privacy control"
            />

            <div className="flex-1 p-6 space-y-6">
                {/* Verification Queue */}
                <Card className="border-amber-200">
                    <CardHeader className="bg-amber-50/50">
                        <CardTitle className="flex items-center gap-2 text-amber-900">
                            <ShieldAlert className="h-5 w-5 text-amber-600" />
                            Pending Verification Queue
                        </CardTitle>
                        <CardDescription>
                            Review medical proof before activating donors in the secure network.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {pendingProfiles.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6">No pending verifications.</p>
                        ) : (
                            <div className="space-y-4">
                                {pendingProfiles.map(p => (
                                    <div key={p.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-md">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium">{p.donorName || "Unknown"}</span>
                                                <Badge variant="outline" className="font-mono">{p.bloodGroup}</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">{p.donorEmail}</p>
                                            <div className="mt-2 text-sm bg-secondary/50 inline-flex items-center px-2 py-1 rounded">
                                                <FileText className="h-3 w-3 mr-1" />
                                                Proof URL: {p.verificationProofUrl || "None provided"}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4 md:mt-0">
                                            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleVerify(p.id, "REJECTED")}>
                                                <X className="h-4 w-4 mr-1" /> Reject
                                            </Button>
                                            <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleVerify(p.id, "VERIFIED")}>
                                                <Check className="h-4 w-4 mr-1" /> Verify & Activate
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Active Network */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                Active Verified Network
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {verifiedProfiles.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-6">Network empty.</p>
                            ) : (
                                <div className="space-y-3">
                                    {verifiedProfiles.map(p => (
                                        <div key={p.id} className="flex justify-between items-center p-3 border rounded-md bg-secondary/10">
                                            <div>
                                                <div className="font-medium text-sm">{p.donorName}</div>
                                                <div className="text-xs text-muted-foreground">{p.privacyLevel}</div>
                                            </div>
                                            <Badge variant="default" className="font-mono">{p.bloodGroup}</Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Audit Logs */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                Immutable Audit Log
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {logs.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-6">No actions logged.</p>
                            ) : (
                                <div className="space-y-3">
                                    {logs.slice(0, 5).map(log => (
                                        <div key={log.id} className="text-sm p-3 border rounded-md">
                                            <div className="flex justify-between items-start mb-1">
                                                <Badge variant="secondary" className="text-[10px]">{log.action}</Badge>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {new Date(log.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-xs mt-1">{log.details}</p>
                                            <p className="text-[10px] text-muted-foreground mt-1 font-mono">Target: {log.targetId}</p>
                                        </div>
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

"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/frontend/components/ui/card"
import { Badge } from "@/frontend/components/ui/badge"
import { Button } from "@/frontend/components/ui/button"
import { Switch } from "@/frontend/components/ui/switch"
import { Label } from "@/frontend/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/frontend/components/ui/select"
import { Input } from "@/frontend/components/ui/input"
import { Shield, DownloadCloud, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import useSWR from "swr"
import type { RareDonorProfile } from "@/lib/data/types"
import { useAuth } from "@/lib/auth-context"

const fetcher = (url: string) => fetch(url).then(r => r.json())

// Eligible blood groups for rare donor registry
const ELIGIBLE_BLOOD_GROUPS = ["A-", "B-", "AB+", "AB-"]

export function RareDonorCard() {
    const { user } = useAuth()
    const { data: donorsData } = useSWR("/api/donors", fetcher)
    const { data, mutate } = useSWR("/api/rare-donors/profile", fetcher)
    const profile: RareDonorProfile | null = data?.profile

    const [proofUrl, setProofUrl] = useState("")

    // Get current donor's blood group
    const donor = donorsData?.find((d: { email: string }) => d.email === user?.email)
    const isEligible = donor && ELIGIBLE_BLOOD_GROUPS.includes(donor.bloodGroup)

    useEffect(() => {
        if (profile?.verificationProofUrl) {
            setProofUrl(profile.verificationProofUrl)
        }
    }, [profile])

    const handleUpdatePrivacy = async (val: string) => {
        try {
            const res = await fetch("/api/rare-donors/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ privacyLevel: val })
            })
            if (res.ok) {
                toast.success("Privacy level updated")
                mutate()
            }
        } catch (err) {
            toast.error("An error occurred")
        }
    }

    const handleUpdateProof = async () => {
        if (!proofUrl) return
        try {
            const res = await fetch("/api/rare-donors/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ verificationProofUrl: proofUrl })
            })
            if (res.ok) {
                toast.success("Medical proof updated. Awaiting verification.")
                mutate()
            }
        } catch (err) {
            toast.error("An error occurred")
        }
    }

    if (!data || !donorsData) return <div>Loading Rare Donor status...</div>

    // If no profile, they didn't opt in during registration
    if (!profile) return null

    // Show ineligibility message if blood group is not eligible
    if (!isEligible) {
        return (
            <Card className="border-amber-200 shadow-sm mt-6">
                <CardHeader className="bg-amber-50/50 pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2 text-amber-900">
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                            Rare Donor Program
                        </CardTitle>
                        <Badge variant="secondary">Not Eligible</Badge>
                    </div>
                    <CardDescription className="text-amber-700/80">
                        The Rare Blood Registry is only available for donors with blood groups A-, B-, AB+, and AB-.
                        Your blood group ({donor?.bloodGroup || "Unknown"}) does not qualify for this program.
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card className="border-amber-200 shadow-sm mt-6">
            <CardHeader className="bg-amber-50/50 pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2 text-amber-900">
                        <Shield className="h-5 w-5 text-amber-600" />
                        Rare Donor Program
                    </CardTitle>
                    <Badge variant={profile.verificationStatus === "VERIFIED" ? "default" : "secondary"}>
                        {profile.verificationStatus}
                    </Badge>
                </div>
                <CardDescription className="text-amber-700/80">
                    Thank you for joining our specialized high-trust network for {donor?.bloodGroup} donors.
                    {profile.verificationStatus === "PENDING" && " Please upload medical proof to be verified."}
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 grid gap-6 md:grid-cols-2">

                <div className="space-y-4">
                    <div>
                        <Label className="text-sm text-muted-foreground">Privacy Protection Level</Label>
                        <Select defaultValue={profile.privacyLevel} onValueChange={handleUpdatePrivacy}>
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select privacy level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ANONYMIZED">Anonymized (Silent Alerts)</SelectItem>
                                <SelectItem value="EMERGENCY_ONLY">Emergency Only (Critical Alerts)</SelectItem>
                                <SelectItem value="FULL_ADMIN_ONLY">Admin Only Router</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                            We default to Anonymized to heavily protect your identity from hospital systems.
                        </p>
                    </div>

                    <div className="space-y-3 pt-2">
                        <Label className="font-medium text-sm">Medical Proof Link</Label>
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Paste image URL (Demo)"
                                value={proofUrl}
                                onChange={e => setProofUrl(e.target.value)}
                            />
                            <Button variant="secondary" className="shrink-0" onClick={handleUpdateProof}>
                                <DownloadCloud className="h-4 w-4 mr-2" /> Save
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Admins will review this link before activating your profile.</p>
                    </div>

                </div>

                <div className="space-y-4 p-4 rounded-md border border-amber-100 bg-amber-50">
                    <h4 className="font-medium text-sm text-amber-900 flex items-center gap-1.5">
                        <CheckCircle className="h-4 w-4 text-amber-600" /> System Status
                    </h4>
                    <ul className="text-sm space-y-2 text-amber-800">
                        <li className="flex justify-between border-b border-amber-200/50 pb-1">
                            <span>Identity Protection</span> <strong>100% Secure</strong>
                        </li>
                        <li className="flex justify-between border-b border-amber-200/50 pb-1">
                            <span>Network Activation</span> <strong>{profile.isActive ? "Active" : "Inactive"}</strong>
                        </li>
                        <li className="flex justify-between pb-1">
                            <span>Total Matches Found</span> <strong>0</strong>
                        </li>
                    </ul>

                    <div className="flex items-center justify-between p-3 border rounded-md bg-secondary/20 mt-4">
                        <div className="space-y-0.5">
                            <Label>Emergency Contact</Label>
                            <div className="text-xs text-muted-foreground">Allow admins to call you in severe crises</div>
                        </div>
                        <Switch checked={profile.emergencyContactEnabled} disabled />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

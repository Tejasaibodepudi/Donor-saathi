"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/frontend/components/ui/card"
import { Badge } from "@/frontend/components/ui/badge"
import { Button } from "@/frontend/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/frontend/components/ui/select"
import { Label } from "@/frontend/components/ui/label"
import { Network, Activity, MapPin, Loader2 } from "lucide-react"
import { toast } from "sonner"
import useSWR from "swr"
import type { RareDonorRequest } from "@/lib/data/types"

const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) {
        const error: any = new Error('API request failed')
        error.status = res.status
        const data = await res.json().catch(() => ({}))
        error.message = data.error || `HTTP ${res.status}`
        throw error
    }
    return res.json()
}

export function RareBloodNetworkCard() {
    const { data, mutate, error } = useSWR("/api/rare-donors/request", fetcher)
    const requests: RareDonorRequest[] = data?.requests || []

    const [bloodGroup, setBloodGroup] = useState("")
    const [urgency, setUrgency] = useState("urgent")
    const [isLoading, setIsLoading] = useState(false)

    // Show error if API fails
    if (error) {
        return (
            <Card className="border-red-100 shadow-sm mt-6">
                <CardHeader className="bg-red-50/50 pb-4">
                    <CardTitle className="text-lg text-red-900">Rare Blood Network - Error</CardTitle>
                    <CardDescription className="text-red-700">
                        {error.message === "Unauthorized" 
                            ? "Authentication required. Please log in as a hospital or blood bank to access this feature."
                            : `Failed to load rare donor network. ${error.message || "Please try again later."}`
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                    <Button 
                        variant="outline" 
                        onClick={() => window.location.reload()}
                        className="w-full"
                    >
                        Retry
                    </Button>
                </CardContent>
            </Card>
        )
    }

    // Show loading state
    if (!data) {
        return (
            <Card className="border-indigo-100 shadow-sm mt-6">
                <CardHeader className="bg-indigo-50/50 pb-4">
                    <CardTitle className="text-lg">Rare Blood Network</CardTitle>
                    <CardDescription>Loading network status...</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    const handleRequest = async () => {
        if (!bloodGroup) {
            toast.error("Select a blood group")
            return
        }

        try {
            setIsLoading(true)
            const res = await fetch("/api/rare-donors/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    requiredBloodGroup: bloodGroup,
                    urgencyLevel: urgency,
                    location: { lat: 0, lng: 0, city: "Hospital Location" }
                })
            })

            const responseData = await res.json()

            if (res.ok) {
                toast.success(`Request initiated via Rare Donor Network. ${responseData.request?.matchedDonorCount || 0} donors matched.`)
                mutate()
                setBloodGroup("") // Reset form
            } else {
                toast.error(responseData.error || "Failed to submit request")
            }
        } catch (err) {
            console.error("Rare donor request error:", err)
            toast.error("Network error. Please check your connection.")
        } finally {
            setIsLoading(false)
        }
    }

    // Active requests
    const openRequests = requests.filter(r => r.status === "OPEN" || r.status === "MATCHING" || r.status === "ALERT_SENT")

    return (
        <Card className="border-indigo-100 shadow-sm mt-6 overflow-hidden">
            <CardHeader className="bg-indigo-50/50 pb-4 border-b border-indigo-100">
                <div className="flex items-center gap-2 text-indigo-900">
                    <Network className="h-5 w-5 text-indigo-600" />
                    <CardTitle className="text-lg">Rare Blood Network</CardTitle>
                    <Badge variant="outline" className="ml-auto bg-white text-indigo-700 border-indigo-200">
                        Encrypted Connection
                    </Badge>
                </div>
                <CardDescription className="text-indigo-700/80">
                    Deploy anonymized geographic alerts to compatible rare donors instantly.
                </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                    {/* Action Area */}
                    <div className="p-6 space-y-4 border-r border-indigo-50">
                        <div className="space-y-3">
                            <div>
                                <Label>Required Blood Group</Label>
                                <Select onValueChange={setBloodGroup}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select type..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="O-">O Negative</SelectItem>
                                        <SelectItem value="A-">A Negative</SelectItem>
                                        <SelectItem value="B-">B Negative</SelectItem>
                                        <SelectItem value="AB-">AB Negative</SelectItem>
                                        <SelectItem value="AB+">AB Positive (Rare Subtypes)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Urgency Protocol</Label>
                                <Select defaultValue="urgent" onValueChange={setUrgency}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="normal">Normal (Routine Search)</SelectItem>
                                        <SelectItem value="urgent">Urgent</SelectItem>
                                        <SelectItem value="critical">Critical (Ignores "Emergency Only" block)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button onClick={handleRequest} disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Initiate Network Scan
                        </Button>
                        <p className="text-xs text-center text-muted-foreground pt-1">
                            Guaranteed Zero-PII Exposure Compliance
                        </p>
                    </div>

                    {/* Status Metrics Area */}
                    <div className="p-6 bg-slate-50/50 flex flex-col justify-center">
                        {openRequests.length > 0 ? (
                            <div className="space-y-4">
                                <div className="bg-green-50 text-green-800 p-3 rounded-md text-sm font-medium border border-green-200 shadow-sm flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
                                    Rare donor network available — request initiated.
                                </div>

                                <div className="space-y-3">
                                    {openRequests.map(req => (
                                        <div key={req.id} className="bg-white p-3 rounded-md border text-sm shadow-sm">
                                            <div className="flex justify-between items-center mb-2">
                                                <Badge variant="outline" className="font-mono">{req.requiredBloodGroup}</Badge>
                                                <Badge variant="secondary" className="text-xs capitalize">{req.status}</Badge>
                                            </div>
                                            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Zone Coverage: Active</span>
                                                <span>{req.matchedDonorCount} Donors Pinged</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-8">
                                <Network className="h-8 w-8 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">No active rare network scans.</p>
                                <p className="text-xs mt-1">Initiate a scan to query the anonymized donor pool.</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

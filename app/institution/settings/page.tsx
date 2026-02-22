"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

export default function SettingsPage() {
    const { user } = useAuth()

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        toast.success("Settings updated successfully (Demo)")
    }

    return (
        <div className="flex flex-1 flex-col">
            <DashboardHeader title="Institution Settings" subtitle="Manage your college/corporate profile" />
            <div className="flex-1 p-6 space-y-6 max-w-2xl">

                <Card>
                    <CardHeader>
                        <CardTitle>Organization Profile</CardTitle>
                        <CardDescription>Update your contact and location details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Organization Name</Label>
                                <Input defaultValue={user?.name} disabled />
                                <p className="text-xs text-muted-foreground">To change your organization name, please contact support.</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Contact Email</Label>
                                <Input type="email" defaultValue={user?.email} />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input type="tel" placeholder="+91 9876543210" />
                            </div>
                            <div className="pt-4">
                                <Button type="submit">Save Changes</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}

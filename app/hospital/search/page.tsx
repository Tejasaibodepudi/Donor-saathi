"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { BloodGroupBadge } from "@/components/blood-group-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Phone } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(r => r.json())
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

interface BloodBank {
  id: string
  name: string
  address: string
  phone: string
  verified: boolean
  inventory: Record<string, number>
}

export default function HospitalSearchPage() {
  const [selectedGroup, setSelectedGroup] = useState<string>("")
  const { data: banks } = useSWR<BloodBank[]>("/api/blood-banks", fetcher)

  const filteredBanks = banks?.filter((bank) => {
    if (!selectedGroup || selectedGroup === "all") return true
    return (bank.inventory?.[selectedGroup] || 0) > 0
  }) || []

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader title="Search Blood" subtitle="Find available blood units across the network" />
      <div className="flex-1 p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Filters
            </CardTitle>
            <CardDescription>Filter blood banks by blood group availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-end gap-4">
              <div className="min-w-[200px] flex-1">
                <label className="mb-1.5 block text-sm font-medium">Blood Group</label>
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Groups</SelectItem>
                    {bloodGroups.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setSelectedGroup("")} variant="outline">
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredBanks.map((bank) => (
            <Card key={bank.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{bank.name}</CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {bank.address}
                    </CardDescription>
                  </div>
                  {bank.verified && (
                    <Badge variant="secondary" className="bg-success/10 text-success">Verified</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {bank.phone}
                </div>
                <p className="mb-2 text-sm font-medium">Available Units:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(bank.inventory || {}).map(([group, units]) => (
                    <div key={group} className="flex items-center gap-1.5">
                      <BloodGroupBadge group={group} />
                      <span className="text-sm text-muted-foreground">
                        {units as number} units
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredBanks.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No blood banks found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

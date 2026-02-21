"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import useSWR from "swr"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
} from "recharts"

const fetcher = (url: string) => fetch(url).then(r => r.json())

const COLORS = [
  "oklch(0.45 0.2 15)",
  "oklch(0.6 0.12 185)",
  "oklch(0.55 0.15 250)",
  "oklch(0.75 0.15 85)",
  "oklch(0.65 0.18 40)",
]

const donationTrend = [
  { month: "Sep", donations: 45 },
  { month: "Oct", donations: 52 },
  { month: "Nov", donations: 61 },
  { month: "Dec", donations: 38 },
  { month: "Jan", donations: 72 },
  { month: "Feb", donations: 55 },
]

export default function AdminAnalyticsPage() {
  const { data: stats } = useSWR("/api/admin/stats", fetcher)

  const inventoryData = stats?.inventorySummary
    ? Object.entries(stats.inventorySummary).map(([group, units]) => ({
        group,
        units: units as number,
      }))
    : []

  const roleData = stats
    ? [
        { name: "Donors", value: stats.donors },
        { name: "Blood Banks", value: stats.bloodBanks },
        { name: "Hospitals", value: stats.hospitals },
        { name: "Admins", value: stats.admins },
      ]
    : []

  const statusData = stats?.appointmentsByStatus
    ? Object.entries(stats.appointmentsByStatus).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count as number,
      }))
    : []

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader title="Analytics" subtitle="Detailed system analytics and reporting" />
      <div className="flex-1 p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Donation Trends</CardTitle>
              <CardDescription>Monthly donation count over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={donationTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(1 0 0)",
                      border: "1px solid oklch(0.91 0.01 15)",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="donations"
                    stroke="oklch(0.45 0.2 15)"
                    fill="oklch(0.45 0.2 15 / 0.15)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory by Blood Group</CardTitle>
              <CardDescription>Total units across all blood banks</CardDescription>
            </CardHeader>
            <CardContent>
              {inventoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={inventoryData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="group" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(1 0 0)",
                        border: "1px solid oklch(0.91 0.01 15)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="units" fill="oklch(0.45 0.2 15)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">Loading...</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Users by Role</CardTitle>
              <CardDescription>Distribution of platform users</CardDescription>
            </CardHeader>
            <CardContent>
              {roleData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={roleData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {roleData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">Loading...</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appointments by Status</CardTitle>
              <CardDescription>Breakdown of appointment statuses</CardDescription>
            </CardHeader>
            <CardContent>
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {statusData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">Loading...</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

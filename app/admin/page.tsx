"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, Calendar, AlertTriangle } from "lucide-react"
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
} from "recharts"

const fetcher = (url: string) => fetch(url).then(r => r.json())

const PIE_COLORS = [
  "oklch(0.45 0.2 15)",
  "oklch(0.6 0.12 185)",
  "oklch(0.55 0.15 250)",
  "oklch(0.75 0.15 85)",
]

export default function AdminDashboard() {
  const { data: stats } = useSWR("/api/admin/stats", fetcher)

  const roleData = stats
    ? [
        { name: "Donors", value: stats.donors },
        { name: "Blood Banks", value: stats.bloodBanks },
        { name: "Hospitals", value: stats.hospitals },
        { name: "Admins", value: stats.admins },
      ]
    : []

  const barData = stats?.inventorySummary
    ? Object.entries(stats.inventorySummary).map(([group, units]) => ({
        group,
        units: units as number,
      }))
    : []

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader title="Admin Panel" subtitle="System-wide overview and management" />
      <div className="flex-1 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={Users}
            description="All registered users"
          />
          <StatCard
            title="Blood Banks"
            value={stats?.bloodBanks || 0}
            icon={Building2}
            description="Registered blood banks"
          />
          <StatCard
            title="Appointments"
            value={stats?.totalAppointments || 0}
            icon={Calendar}
            description="Total appointments"
          />
          <StatCard
            title="Active Emergencies"
            value={stats?.activeEmergencies || 0}
            icon={AlertTriangle}
            description="Active requests"
            variant="destructive"
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Blood Inventory Overview</CardTitle>
              <CardDescription>Total units across all blood banks by blood group</CardDescription>
            </CardHeader>
            <CardContent>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
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
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                  Loading chart data...
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Users by Role</CardTitle>
              <CardDescription>Distribution of registered users across roles</CardDescription>
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
                    >
                      {roleData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                  Loading chart data...
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

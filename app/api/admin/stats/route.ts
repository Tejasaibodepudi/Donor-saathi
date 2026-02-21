import { NextResponse } from "next/server"
import { donors, bloodBanks, hospitals, admins, appointments, emergencyRequests, inventory } from "@/lib/data/store"
import { getAuthToken } from "@/lib/auth"

export async function GET() {
  const payload = await getAuthToken()
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const allDonors = Array.from(donors.values())
  const allBBs = Array.from(bloodBanks.values())
  const allHospitals = Array.from(hospitals.values())
  const allAdmins = Array.from(admins.values())
  const allAppointments = Array.from(appointments.values())
  const allEmergencies = Array.from(emergencyRequests.values())
  const allInventory = Array.from(inventory.values())

  // Inventory summary by blood group
  const inventorySummary: Record<string, number> = {}
  allInventory.forEach(i => {
    inventorySummary[i.bloodGroup] = (inventorySummary[i.bloodGroup] || 0) + i.units
  })

  // Appointments by status
  const appointmentsByStatus: Record<string, number> = {}
  allAppointments.forEach(a => {
    appointmentsByStatus[a.status] = (appointmentsByStatus[a.status] || 0) + 1
  })

  return NextResponse.json({
    totalUsers: allDonors.length + allBBs.length + allHospitals.length + allAdmins.length,
    donors: allDonors.length,
    bloodBanks: allBBs.length,
    hospitals: allHospitals.length,
    admins: allAdmins.length,
    totalAppointments: allAppointments.length,
    activeEmergencies: allEmergencies.filter(e => e.status === "active" || e.status === "partially_fulfilled").length,
    inventorySummary,
    appointmentsByStatus,
  })
}

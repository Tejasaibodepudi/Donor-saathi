import { NextResponse } from "next/server"
import dbConnect from "@/database/db"
import { Donor, BloodBank, Hospital, Admin, Appointment, EmergencyRequest, InventoryItem } from "@/database/models"
import { getAuthToken } from "@/lib/auth"

export async function GET() {
  await dbConnect()
  const payload = await getAuthToken()
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [donors, bbs, hospitals, admins, appointments, emergencies, inventory] = await Promise.all([
    Donor.countDocuments(),
    BloodBank.countDocuments(),
    Hospital.countDocuments(),
    Admin.countDocuments(),
    Appointment.find({}).lean() as Promise<any[]>,
    EmergencyRequest.find({}).lean() as Promise<any[]>,
    InventoryItem.find({}).lean() as Promise<any[]>
  ])

  // Inventory summary
  const inventorySummary: Record<string, number> = {}
  inventory.forEach((i: any) => {
    inventorySummary[i.bloodGroup] = (inventorySummary[i.bloodGroup] || 0) + i.units
  })

  // Appointments
  const appointmentsByStatus: Record<string, number> = {}
  appointments.forEach((a: any) => {
    appointmentsByStatus[a.status] = (appointmentsByStatus[a.status] || 0) + 1
  })

  return NextResponse.json({
    totalUsers: donors + bbs + hospitals + admins,
    donors,
    bloodBanks: bbs,
    hospitals,
    admins,
    totalAppointments: appointments.length,
    activeEmergencies: emergencies.filter(e => e.status === "active" || e.status === "partially_fulfilled").length,
    inventorySummary,
    appointmentsByStatus,
  })
}

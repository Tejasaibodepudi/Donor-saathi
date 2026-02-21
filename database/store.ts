import type {
  Donor, BloodBank, Hospital, Admin,
  DonationSlot, Appointment, InventoryItem,
  EmergencyRequest, Notification, BloodGroup,
} from "./types"

// --- In-memory stores ---
export const donors = new Map<string, Donor>()
export const bloodBanks = new Map<string, BloodBank>()
export const hospitals = new Map<string, Hospital>()
export const admins = new Map<string, Admin>()
export const donationSlots = new Map<string, DonationSlot>()
export const appointments = new Map<string, Appointment>()
export const inventory = new Map<string, InventoryItem>()
export const emergencyRequests = new Map<string, EmergencyRequest>()
export const notifications = new Map<string, Notification>()

// --- Helper ---
let counter = 100
export function generateId(): string {
  counter++
  return `id_${counter}_${Date.now().toString(36)}`
}

export const ALL_BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

// --- Seed Data ---
function seed() {
  // Donors
  const seedDonors: Donor[] = [
    {
      id: "donor_1", name: "Rahul Sharma", email: "donor@demo.com", password: "password",
      phone: "+91-9876543210", bloodGroup: "O+", dateOfBirth: "1995-03-15", gender: "male",
      address: "42 MG Road", city: "Mumbai", state: "Maharashtra", lat: 19.076, lng: 72.8777,
      isAvailable: true, lastDonation: "2025-11-15", totalDonations: 8, trustScore: 92,
      status: "active", createdAt: "2024-06-01T10:00:00Z",
    },
    {
      id: "donor_2", name: "Priya Patel", email: "priya@demo.com", password: "password",
      phone: "+91-9876543211", bloodGroup: "A+", dateOfBirth: "1992-07-22", gender: "female",
      address: "15 Park Street", city: "Mumbai", state: "Maharashtra", lat: 19.06, lng: 72.85,
      isAvailable: true, lastDonation: "2025-12-01", totalDonations: 5, trustScore: 85,
      status: "active", createdAt: "2024-08-15T10:00:00Z",
    },
    {
      id: "donor_3", name: "Amit Kumar", email: "amit@demo.com", password: "password",
      phone: "+91-9876543212", bloodGroup: "B+", dateOfBirth: "1988-11-30", gender: "male",
      address: "8 Lajpat Nagar", city: "Delhi", state: "Delhi", lat: 28.5695, lng: 77.2376,
      isAvailable: false, lastDonation: "2025-10-20", totalDonations: 12, trustScore: 96,
      status: "active", createdAt: "2024-03-10T10:00:00Z",
    },
    {
      id: "donor_4", name: "Sara Khan", email: "sara@demo.com", password: "password",
      phone: "+91-9876543213", bloodGroup: "AB-", dateOfBirth: "1997-01-08", gender: "female",
      address: "23 Jubilee Hills", city: "Hyderabad", state: "Telangana", lat: 17.4313, lng: 78.4095,
      isAvailable: true, lastDonation: null, totalDonations: 0, trustScore: 50,
      status: "active", createdAt: "2025-01-20T10:00:00Z",
    },
    {
      id: "donor_5", name: "Vikram Singh", email: "vikram@demo.com", password: "password",
      phone: "+91-9876543214", bloodGroup: "O-", dateOfBirth: "1990-05-18", gender: "male",
      address: "56 Koramangala", city: "Bangalore", state: "Karnataka", lat: 12.9352, lng: 77.6245,
      isAvailable: true, lastDonation: "2025-09-05", totalDonations: 15, trustScore: 98,
      status: "active", createdAt: "2023-12-01T10:00:00Z",
    },
  ]

  // Blood Banks
  const seedBloodBanks: BloodBank[] = [
    {
      id: "bb_1", name: "LifeSource Blood Center", email: "bloodbank@demo.com", password: "password",
      phone: "+91-2234567890", licenseNumber: "BB-MH-2024-001",
      address: "12 Hospital Road, Andheri", city: "Mumbai", state: "Maharashtra",
      lat: 19.1136, lng: 72.8697, operatingHours: "8:00 AM - 8:00 PM",
      status: "verified", createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "bb_2", name: "RedCross Blood Bank", email: "redcross@demo.com", password: "password",
      phone: "+91-2234567891", licenseNumber: "BB-MH-2024-002",
      address: "45 Civil Lines", city: "Delhi", state: "Delhi",
      lat: 28.6817, lng: 77.2220, operatingHours: "9:00 AM - 6:00 PM",
      status: "verified", createdAt: "2024-02-20T10:00:00Z",
    },
    {
      id: "bb_3", name: "Hope Blood Services", email: "hope@demo.com", password: "password",
      phone: "+91-2234567892", licenseNumber: "BB-KA-2024-003",
      address: "78 Indiranagar", city: "Bangalore", state: "Karnataka",
      lat: 12.9716, lng: 77.6441, operatingHours: "7:00 AM - 9:00 PM",
      status: "pending", createdAt: "2025-01-05T10:00:00Z",
    },
  ]

  // Hospitals
  const seedHospitals: Hospital[] = [
    {
      id: "hosp_1", name: "City General Hospital", email: "hospital@demo.com", password: "password",
      phone: "+91-2298765432", registrationNumber: "HOSP-MH-2024-001",
      address: "100 Hospital Avenue", city: "Mumbai", state: "Maharashtra",
      lat: 19.0825, lng: 72.8815, departments: ["Emergency", "Surgery", "ICU", "Oncology"],
      status: "verified", createdAt: "2024-01-01T10:00:00Z",
    },
    {
      id: "hosp_2", name: "National Medical Institute", email: "nmi@demo.com", password: "password",
      phone: "+91-2298765433", registrationNumber: "HOSP-DL-2024-002",
      address: "50 AIIMS Road", city: "Delhi", state: "Delhi",
      lat: 28.5672, lng: 77.2100, departments: ["Emergency", "Cardiology", "Neurology", "Pediatrics"],
      status: "verified", createdAt: "2024-02-01T10:00:00Z",
    },
  ]

  // Admin
  const seedAdmins: Admin[] = [
    {
      id: "admin_1", name: "System Admin", email: "admin@demo.com", password: "password",
      role: "admin", createdAt: "2024-01-01T00:00:00Z",
    },
  ]

  // Donation Slots
  const today = new Date()
  const seedSlots: DonationSlot[] = []
  for (let d = 0; d < 7; d++) {
    const date = new Date(today)
    date.setDate(date.getDate() + d)
    const dateStr = date.toISOString().split("T")[0]
    seedSlots.push(
      { id: `slot_${d}_1`, bloodBankId: "bb_1", date: dateStr, startTime: "09:00", endTime: "10:00", capacity: 5, booked: d === 0 ? 2 : 0, isActive: true },
      { id: `slot_${d}_2`, bloodBankId: "bb_1", date: dateStr, startTime: "10:00", endTime: "11:00", capacity: 5, booked: 0, isActive: true },
      { id: `slot_${d}_3`, bloodBankId: "bb_1", date: dateStr, startTime: "14:00", endTime: "15:00", capacity: 4, booked: 0, isActive: true },
      { id: `slot_${d}_4`, bloodBankId: "bb_2", date: dateStr, startTime: "09:00", endTime: "10:30", capacity: 6, booked: d === 0 ? 1 : 0, isActive: true },
      { id: `slot_${d}_5`, bloodBankId: "bb_2", date: dateStr, startTime: "11:00", endTime: "12:30", capacity: 6, booked: 0, isActive: true },
    )
  }

  // Appointments
  const seedAppointments: Appointment[] = [
    {
      id: "apt_1", donorId: "donor_1", bloodBankId: "bb_1", slotId: "slot_0_1",
      qrCode: "BSN-APT1-2026", status: "booked",
      bookedAt: new Date(Date.now() - 86400000).toISOString(),
      checkedInAt: null, completedAt: null, notes: "",
    },
    {
      id: "apt_2", donorId: "donor_2", bloodBankId: "bb_1", slotId: "slot_0_1",
      qrCode: "BSN-APT2-2026", status: "booked",
      bookedAt: new Date(Date.now() - 43200000).toISOString(),
      checkedInAt: null, completedAt: null, notes: "",
    },
    {
      id: "apt_3", donorId: "donor_1", bloodBankId: "bb_2", slotId: "slot_0_4",
      qrCode: "BSN-APT3-2026", status: "completed",
      bookedAt: "2025-11-10T10:00:00Z",
      checkedInAt: "2025-11-15T09:05:00Z", completedAt: "2025-11-15T09:45:00Z", notes: "Successful donation",
    },
  ]

  // Inventory
  const seedInventory: InventoryItem[] = []
  const bloodGroups: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  const bbIds = ["bb_1", "bb_2", "bb_3"]
  const baseUnits = [25, 8, 18, 5, 12, 3, 30, 6]
  let invIdx = 0
  for (const bbId of bbIds) {
    for (let g = 0; g < bloodGroups.length; g++) {
      invIdx++
      const multiplier = bbId === "bb_1" ? 1 : bbId === "bb_2" ? 0.8 : 0.4
      seedInventory.push({
        id: `inv_${invIdx}`,
        bloodBankId: bbId,
        bloodGroup: bloodGroups[g],
        units: Math.round(baseUnits[g] * multiplier),
        lastUpdated: new Date().toISOString(),
      })
    }
  }

  // Emergency Requests
  const seedEmergency: EmergencyRequest[] = [
    {
      id: "emrg_1", requesterId: "hosp_1", requesterType: "hospital",
      requesterName: "City General Hospital",
      bloodGroup: "O-", unitsNeeded: 5, unitsFulfilled: 2, priority: "critical",
      status: "active", contactPhone: "+91-2298765432", hospital: "City General Hospital",
      reason: "Major trauma surgery - multiple victims", createdAt: new Date(Date.now() - 3600000).toISOString(),
      expiresAt: new Date(Date.now() + 21600000).toISOString(),
    },
    {
      id: "emrg_2", requesterId: "hosp_2", requesterType: "hospital",
      requesterName: "National Medical Institute",
      bloodGroup: "AB+", unitsNeeded: 3, unitsFulfilled: 0, priority: "urgent",
      status: "active", contactPhone: "+91-2298765433", hospital: "National Medical Institute",
      reason: "Emergency cardiac surgery", createdAt: new Date(Date.now() - 7200000).toISOString(),
      expiresAt: new Date(Date.now() + 43200000).toISOString(),
    },
  ]

  // Notifications
  const seedNotifications: Notification[] = [
    {
      id: "notif_1", userId: "donor_1", userRole: "donor",
      title: "Appointment Confirmed", message: "Your donation appointment at LifeSource Blood Center has been confirmed for tomorrow.",
      type: "success", read: false, createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "notif_2", userId: "donor_1", userRole: "donor",
      title: "Emergency Blood Request", message: "Urgent need for O- blood at City General Hospital. Your blood type matches!",
      type: "emergency", read: false, createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: "notif_3", userId: "bb_1", userRole: "blood_bank",
      title: "Low Inventory Alert", message: "A- blood supply is running low (8 units remaining).",
      type: "warning", read: false, createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: "notif_4", userId: "hosp_1", userRole: "hospital",
      title: "Emergency Request Update", message: "2 units of O- blood have been fulfilled for your emergency request.",
      type: "info", read: true, createdAt: new Date(Date.now() - 5400000).toISOString(),
    },
    {
      id: "notif_5", userId: "admin_1", userRole: "admin",
      title: "New Blood Bank Registration", message: "Hope Blood Services has registered and is pending verification.",
      type: "info", read: false, createdAt: new Date(Date.now() - 10800000).toISOString(),
    },
  ]

  // Populate stores
  seedDonors.forEach(d => donors.set(d.id, d))
  seedBloodBanks.forEach(b => bloodBanks.set(b.id, b))
  seedHospitals.forEach(h => hospitals.set(h.id, h))
  seedAdmins.forEach(a => admins.set(a.id, a))
  seedSlots.forEach(s => donationSlots.set(s.id, s))
  seedAppointments.forEach(a => appointments.set(a.id, a))
  seedInventory.forEach(i => inventory.set(i.id, i))
  seedEmergency.forEach(e => emergencyRequests.set(e.id, e))
  seedNotifications.forEach(n => notifications.set(n.id, n))
}

// Auto-seed on import
seed()

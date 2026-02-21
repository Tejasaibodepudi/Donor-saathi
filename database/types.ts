export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"

export type UserRole = "donor" | "blood_bank" | "hospital" | "admin"

export type DonorStatus = "active" | "inactive" | "blocked"
export type BloodBankStatus = "pending" | "verified" | "blocked"
export type HospitalStatus = "pending" | "verified" | "blocked"
export type AppointmentStatus = "booked" | "checked_in" | "completed" | "cancelled"
export type EmergencyPriority = "critical" | "urgent" | "normal"
export type EmergencyStatus = "active" | "partially_fulfilled" | "fulfilled" | "expired"

export interface Donor {
  id: string
  name: string
  email: string
  password: string
  phone: string
  bloodGroup: BloodGroup
  dateOfBirth: string
  gender: "male" | "female" | "other"
  address: string
  city: string
  state: string
  lat: number
  lng: number
  isAvailable: boolean
  lastDonation: string | null
  totalDonations: number
  trustScore: number
  status: DonorStatus
  createdAt: string
}

export interface BloodBank {
  id: string
  name: string
  email: string
  password: string
  phone: string
  licenseNumber: string
  address: string
  city: string
  state: string
  lat: number
  lng: number
  operatingHours: string
  status: BloodBankStatus
  createdAt: string
}

export interface Hospital {
  id: string
  name: string
  email: string
  password: string
  phone: string
  registrationNumber: string
  address: string
  city: string
  state: string
  lat: number
  lng: number
  departments: string[]
  status: HospitalStatus
  createdAt: string
}

export interface Admin {
  id: string
  name: string
  email: string
  password: string
  role: "admin"
  createdAt: string
}

export interface DonationSlot {
  id: string
  bloodBankId: string
  date: string
  startTime: string
  endTime: string
  capacity: number
  booked: number
  isActive: boolean
}

export interface Appointment {
  id: string
  donorId: string
  bloodBankId: string
  slotId: string
  qrCode: string
  status: AppointmentStatus
  bookedAt: string
  checkedInAt: string | null
  completedAt: string | null
  notes: string
}

export interface InventoryItem {
  id: string
  bloodBankId: string
  bloodGroup: BloodGroup
  units: number
  lastUpdated: string
}

export interface EmergencyRequest {
  id: string
  requesterId: string
  requesterType: "hospital" | "blood_bank"
  requesterName: string
  bloodGroup: BloodGroup
  unitsNeeded: number
  unitsFulfilled: number
  priority: EmergencyPriority
  status: EmergencyStatus
  contactPhone: string
  hospital: string
  reason: string
  createdAt: string
  expiresAt: string
}

export interface Notification {
  id: string
  userId: string
  userRole: UserRole
  title: string
  message: string
  type: "info" | "success" | "warning" | "emergency"
  read: boolean
  createdAt: string
}

export type AnyUser = (Donor & { role: "donor" }) | (BloodBank & { role: "blood_bank" }) | (Hospital & { role: "hospital" }) | (Admin & { role: "admin" })

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"

export type UserRole = "donor" | "blood_bank" | "hospital" | "admin" | "institution"

export type DonorStatus = "active" | "inactive" | "blocked"
export type BloodBankStatus = "pending" | "verified" | "blocked"
export type HospitalStatus = "pending" | "verified" | "blocked"
export type InstitutionStatus = "pending" | "verified" | "blocked"
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

export interface Institution {
  id: string
  name: string
  email: string
  password: string
  phone: string
  address: string
  city: string
  state: string
  lat: number
  lng: number
  status: InstitutionStatus
  createdAt: string
}

export type AnyUser = (Donor & { role: "donor" }) | (BloodBank & { role: "blood_bank" }) | (Hospital & { role: "hospital" }) | (Admin & { role: "admin" }) | (Institution & { role: "institution" })

// --- CORPORATE / COLLEGE BLOOD DRIVE MODULE ---
export type BloodDriveStatus = "pending" | "approved" | "completed" | "cancelled" | "declined"

export interface BloodDrive {
  id: string
  institutionId: string
  bloodBankId: string
  date: string
  name: string
  status: BloodDriveStatus
  estimatedDonors: number
  createdAt: string
  updatedAt: string
}

export interface BloodDriveDonor {
  id: string
  driveId: string
  name: string
  bloodGroup: BloodGroup | "Unknown"
  status: "registered" | "donated"
  createdAt: string
}

// --- RARE BLOOD GROUP REGISTRY MODULE (APPEND ONLY) ---

export type RarePrivacyLevel = "ANONYMIZED" | "EMERGENCY_ONLY" | "FULL_ADMIN_ONLY"
export type RareVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED"
export type RareRequestStatus = "OPEN" | "MATCHING" | "ALERT_SENT" | "FULFILLED" | "CLOSED"
export type RareAlertStatus = "PENDING" | "SENT" | "ACKNOWLEDGED" | "DECLINED"

export interface RareDonorProfile {
  id: string
  userId: string // FK to existing user (soft-linked)
  bloodGroup: BloodGroup
  isRareConfirmed: boolean
  privacyLevel: RarePrivacyLevel
  emergencyContactEnabled: boolean
  isActive: boolean
  lastAvailabilityUpdate: string // ISO timestamp
  verificationStatus: RareVerificationStatus
  verifiedByAdminId: string | null
  verificationProofUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface RareDonorRequest {
  id: string
  requesterType: "HOSPITAL" | "BLOOD_BANK"
  requesterId: string
  requiredBloodGroup: BloodGroup
  urgencyLevel: EmergencyPriority
  location: {
    lat: number
    lng: number
    city: string
  }
  status: RareRequestStatus
  matchedDonorCount: number
  createdAt: string
  updatedAt: string
}

export interface RareAlertQueue {
  id: string
  requestId: string
  donorUserId: string
  alertStatus: RareAlertStatus
  priorityScore: number
  createdAt: string
}

export interface AdminAuditLog {
  id: string
  adminId: string
  action: "VERIFY_DONOR" | "REJECT_DONOR" | "OVERRIDE_ROUTING" | "ABUSE_FLAG"
  targetId: string // e.g., donor userId or requestId
  details: string
  createdAt: string
}

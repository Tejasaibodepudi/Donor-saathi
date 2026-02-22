import mongoose, { Schema } from "mongoose"

// -- Users --
const DonorSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    isAvailable: { type: Boolean, required: true, default: true },
    lastDonation: { type: String, default: null },
    totalDonations: { type: Number, required: true, default: 0 },
    trustScore: { type: Number, required: true, default: 50 },
    status: { type: String, required: true, default: "active" },
    createdAt: { type: String, required: true },
})

const BloodBankSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    operatingHours: { type: String, required: true },
    status: { type: String, required: true, default: "pending" },
    createdAt: { type: String, required: true },
})

const HospitalSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    departments: [{ type: String }],
    status: { type: String, required: true, default: "pending" },
    createdAt: { type: String, required: true },
})

const AdminSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "admin" },
    createdAt: { type: String, required: true },
})

const InstitutionSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    status: { type: String, required: true, default: "pending" },
    createdAt: { type: String, required: true },
})

// -- Core Operations --
const DonationSlotSchema = new Schema({
    id: { type: String, required: true, unique: true },
    bloodBankId: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    capacity: { type: Number, required: true },
    booked: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, required: true, default: true },
})

const AppointmentSchema = new Schema({
    id: { type: String, required: true, unique: true },
    donorId: { type: String, required: true },
    bloodBankId: { type: String, required: true },
    slotId: { type: String, required: true },
    qrCode: { type: String, required: true },
    status: { type: String, required: true },
    bookedAt: { type: String, required: true },
    checkedInAt: { type: String, default: null },
    completedAt: { type: String, default: null },
    notes: { type: String, default: "" },
})

const InventoryItemSchema = new Schema({
    id: { type: String, required: true, unique: true },
    bloodBankId: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    units: { type: Number, required: true, default: 0 },
    lastUpdated: { type: String, required: true },
})

const EmergencyRequestSchema = new Schema({
    id: { type: String, required: true, unique: true },
    requesterId: { type: String, required: true },
    requesterType: { type: String, required: true },
    requesterName: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    unitsNeeded: { type: Number, required: true },
    unitsFulfilled: { type: Number, required: true, default: 0 },
    priority: { type: String, required: true },
    status: { type: String, required: true, default: "active" },
    contactPhone: { type: String, required: true },
    hospital: { type: String, required: true },
    reason: { type: String, required: true },
    createdAt: { type: String, required: true },
    expiresAt: { type: String, required: true },
})

const NotificationSchema = new Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    userRole: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, required: true },
    read: { type: Boolean, required: true, default: false },
    createdAt: { type: String, required: true },
})

// -- Corporate / College Blood Drives --
const BloodDriveSchema = new Schema({
    id: { type: String, required: true, unique: true },
    institutionId: { type: String, required: true },
    bloodBankId: { type: String, required: true },
    date: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String, required: true, default: "pending" },
    estimatedDonors: { type: Number, required: true, default: 0 },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
})

const BloodDriveDonorSchema = new Schema({
    id: { type: String, required: true, unique: true },
    driveId: { type: String, required: true },
    name: { type: String, required: true },
    bloodGroup: { type: String, required: true, default: "Unknown" },
    status: { type: String, required: true, default: "registered" },
    createdAt: { type: String, required: true },
})

// -- Rare Donor Registry --
const RareDonorProfileSchema = new Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    isRareConfirmed: { type: Boolean, required: true, default: false },
    privacyLevel: { type: String, required: true, default: "ANONYMIZED" },
    emergencyContactEnabled: { type: Boolean, required: true, default: true },
    isActive: { type: Boolean, required: true, default: true },
    lastAvailabilityUpdate: { type: String, required: true },
    verificationStatus: { type: String, required: true, default: "PENDING" },
    verifiedByAdminId: { type: String, default: null },
    verificationProofUrl: { type: String, default: null },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
})

const RareDonorRequestSchema = new Schema({
    id: { type: String, required: true, unique: true },
    requesterType: { type: String, required: true },
    requesterId: { type: String, required: true },
    requiredBloodGroup: { type: String, required: true },
    urgencyLevel: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        city: { type: String, required: true },
    },
    status: { type: String, required: true, default: "OPEN" },
    matchedDonorCount: { type: Number, required: true, default: 0 },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
})

const RareAlertQueueSchema = new Schema({
    id: { type: String, required: true, unique: true },
    requestId: { type: String, required: true },
    donorUserId: { type: String, required: true },
    alertStatus: { type: String, required: true, default: "PENDING" },
    priorityScore: { type: Number, required: true, default: 0 },
    createdAt: { type: String, required: true },
})

const AdminAuditLogSchema = new Schema({
    id: { type: String, required: true, unique: true },
    adminId: { type: String, required: true },
    action: { type: String, required: true },
    targetId: { type: String, required: true },
    details: { type: String, required: true },
    createdAt: { type: String, required: true },
})

// Mongoose model caching wrappers
export const Donor = mongoose.models.Donor || mongoose.model("Donor", DonorSchema)
export const BloodBank = mongoose.models.BloodBank || mongoose.model("BloodBank", BloodBankSchema)
export const Hospital = mongoose.models.Hospital || mongoose.model("Hospital", HospitalSchema)
export const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema)

export const DonationSlot = mongoose.models.DonationSlot || mongoose.model("DonationSlot", DonationSlotSchema)
export const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema)
export const InventoryItem = mongoose.models.InventoryItem || mongoose.model("InventoryItem", InventoryItemSchema)
export const EmergencyRequest = mongoose.models.EmergencyRequest || mongoose.model("EmergencyRequest", EmergencyRequestSchema)
export const Notification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema)

export const RareDonorProfile = mongoose.models.RareDonorProfile || mongoose.model("RareDonorProfile", RareDonorProfileSchema)
export const RareDonorRequest = mongoose.models.RareDonorRequest || mongoose.model("RareDonorRequest", RareDonorRequestSchema)
export const RareAlertQueue = mongoose.models.RareAlertQueue || mongoose.model("RareAlertQueue", RareAlertQueueSchema)
export const AdminAuditLog = mongoose.models.AdminAuditLog || mongoose.model("AdminAuditLog", AdminAuditLogSchema)
export const Institution = mongoose.models.Institution || mongoose.model("Institution", InstitutionSchema)
export const BloodDrive = mongoose.models.BloodDrive || mongoose.model("BloodDrive", BloodDriveSchema)
export const BloodDriveDonor = mongoose.models.BloodDriveDonor || mongoose.model("BloodDriveDonor", BloodDriveDonorSchema)

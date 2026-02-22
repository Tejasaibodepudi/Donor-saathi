import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "path"
import {
    donors, bloodBanks, hospitals, admins,
    donationSlots, appointments, inventory, emergencyRequests, notifications,
    rareDonorProfiles, rareDonorRequests, rareAlertQueue, adminAuditLogs
} from "./store"
import {
    Donor, BloodBank, Hospital, Admin,
    DonationSlot, Appointment, InventoryItem, EmergencyRequest, Notification,
    RareDonorProfile, RareDonorRequest, RareAlertQueue, AdminAuditLog
} from "./models"

// Load env from root
dotenv.config({ path: path.join(process.cwd(), ".env") })

async function seed() {
    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error("Missing MONGODB_URI in .env")

    await mongoose.connect(uri)
    console.log("Connected to MongoDB for seeding: ", uri)

    // Clear existing
    await mongoose.connection.db?.dropDatabase()
    console.log("Dropped existing database objects")

    // Insert standard data
    console.log(`Seeding ${donors.size} Donors...`)
    await Donor.insertMany(Array.from(donors.values()))

    console.log(`Seeding ${bloodBanks.size} Blood Banks...`)
    await BloodBank.insertMany(Array.from(bloodBanks.values()))

    console.log(`Seeding ${hospitals.size} Hospitals...`)
    await Hospital.insertMany(Array.from(hospitals.values()))

    console.log(`Seeding ${admins.size} Admins...`)
    await Admin.insertMany(Array.from(admins.values()))

    console.log(`Seeding ${donationSlots.size} Donation Slots...`)
    await DonationSlot.insertMany(Array.from(donationSlots.values()))

    console.log(`Seeding ${appointments.size} Appointments...`)
    await Appointment.insertMany(Array.from(appointments.values()))

    console.log(`Seeding ${inventory.size} Inventory records...`)
    await InventoryItem.insertMany(Array.from(inventory.values()))

    console.log(`Seeding ${emergencyRequests.size} Emergency Requests...`)
    await EmergencyRequest.insertMany(Array.from(emergencyRequests.values()))

    console.log(`Seeding ${notifications.size} Notifications...`)
    await Notification.insertMany(Array.from(notifications.values()))

    // Insert Rare Donor data
    if (rareDonorProfiles.size > 0) {
        console.log("Seeding Rare Registry Network...")
        await RareDonorProfile.insertMany(Array.from(rareDonorProfiles.values()))
        await RareDonorRequest.insertMany(Array.from(rareDonorRequests.values()))
        await RareAlertQueue.insertMany(Array.from(rareAlertQueue.values()))
        await AdminAuditLog.insertMany(Array.from(adminAuditLogs.values()))
    }

    console.log("✅ Seeding complete!")
    process.exit(0)
}

seed().catch(err => {
    console.error("Seeding failed", err)
    process.exit(1)
})

/**
 * Database seed script
 * Run: npm run seed
 * Seeds the database with sample government services, branches, and time slots.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Service = require("../models/Service");
const Branch = require("../models/Branch");
const Slot = require("../models/Slot");

const SERVICES = [
  {
    name: "خدمات الجوازات",
    description: "استخراج جواز سفر جديد أو تجديد أو بدل فاقد",
    icon: "passport",
  },
  {
    name: "بطاقة الرقم القومي",
    description: "استخراج أو تجديد بطاقة الرقم القومي",
    icon: "id-card",
  },
  {
    name: "رخصة القيادة",
    description: "رخصة جديدة أو تجديد أو رخصة دولية",
    icon: "car",
  },
  {
    name: "شهادة الميلاد",
    description: "طلب نسخة من شهادة الميلاد أو تصحيح بياناتها",
    icon: "file-text",
  },
  {
    name: "الشهر العقاري",
    description: "تسجيل ملكية العقارات ونقل الملكية",
    icon: "home",
  },
  {
    name: "الخدمات الضريبية",
    description: "الإقرارات الضريبية وشهادات المخالصة",
    icon: "receipt",
  },
];

const BRANCH_TEMPLATES = [
  { name: "المقر الرئيسي", city: "القاهرة", address: "15 ميدان التحرير، وسط البلد" },
  { name: "فرع شمال الدلتا", city: "الإسكندرية", address: "42 طريق الكورنيش، الإسكندرية" },
  { name: "مركز خدمات الجيزة", city: "الجيزة", address: "88 شارع الأهرام، الجيزة" },
  { name: "الفرع الإقليمي", city: "المنصورة", address: "7 شارع الجمهورية، المنصورة" },
];

function generateSlots(branchId) {
  const slots = [];
  const times = [
    { start: "09:00", end: "09:30" },
    { start: "09:30", end: "10:00" },
    { start: "10:00", end: "10:30" },
    { start: "10:30", end: "11:00" },
    { start: "11:00", end: "11:30" },
    { start: "11:30", end: "12:00" },
    { start: "13:00", end: "13:30" },
    { start: "13:30", end: "14:00" },
    { start: "14:00", end: "14:30" },
    { start: "14:30", end: "15:00" },
  ];

  // Generate slots for the next 14 days (skip Fridays = day 5)
  for (let dayOffset = 1; dayOffset <= 14; dayOffset++) {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    date.setHours(0, 0, 0, 0);

    if (date.getDay() === 5) continue; // Skip Friday

    for (const time of times) {
      slots.push({
        branchId,
        date,
        startTime: time.start,
        endTime: time.end,
        capacity: 3,
        bookedCount: 0,
      });
    }
  }
  return slots;
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Promise.all([Service.deleteMany(), Branch.deleteMany(), Slot.deleteMany()]);
    console.log("Cleared existing data");

    // Create services
    const services = await Service.insertMany(SERVICES);
    console.log(`Created ${services.length} services`);

    // Create branches for each service
    let branchCount = 0;
    let slotCount = 0;

    for (const service of services) {
      const branchDocs = BRANCH_TEMPLATES.map((b) => ({
        ...b,
        serviceId: service._id,
      }));
      const branches = await Branch.insertMany(branchDocs);
      branchCount += branches.length;

      // Create slots for each branch
      for (const branch of branches) {
        const slots = generateSlots(branch._id);
        await Slot.insertMany(slots);
        slotCount += slots.length;
      }
    }

    console.log(`Created ${branchCount} branches`);
    console.log(`Created ${slotCount} time slots`);
    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();

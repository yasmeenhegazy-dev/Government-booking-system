const mongoose = require("mongoose");
const { MongoMemoryReplSet } = require("mongodb-memory-server");

let replSet;

const connectDB = async () => {
  try {
    // Use in-memory MongoDB replica set (needed for transactions)
    console.log("Starting in-memory MongoDB (first run may download binaries)...");
    replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    const uri = replSet.getUri();

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: in-memory (${conn.connection.host})`);

    // Auto-seed on startup so the app is ready to use immediately
    await seedDatabase();
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

async function seedDatabase() {
  const Service = require("../models/Service");
  const Branch = require("../models/Branch");
  const Slot = require("../models/Slot");

  const existingServices = await Service.countDocuments();
  if (existingServices > 0) return; // Already seeded

  console.log("Seeding database...");

  const SERVICES = [
    { name: "خدمات الجوازات", nameEn: "Passport Services", description: "استخراج جواز سفر جديد أو تجديد أو بدل فاقد", descriptionEn: "Apply for new passport, renewal, or replacement", icon: "passport" },
    { name: "بطاقة الرقم القومي", nameEn: "National ID Card", description: "استخراج أو تجديد بطاقة الرقم القومي", descriptionEn: "Issue or renew your national identification card", icon: "id-card" },
    { name: "رخصة القيادة", nameEn: "Driving License", description: "رخصة جديدة أو تجديد أو رخصة دولية", descriptionEn: "New license, renewal, or international driving permit", icon: "car" },
    { name: "شهادة الميلاد", nameEn: "Birth Certificate", description: "طلب نسخة من شهادة الميلاد أو تصحيح بياناتها", descriptionEn: "Request birth certificate copy or correction", icon: "file-text" },
    { name: "الشهر العقاري", nameEn: "Property Registration", description: "تسجيل ملكية العقارات ونقل الملكية", descriptionEn: "Register property ownership or transfer deeds", icon: "home" },
    { name: "الخدمات الضريبية", nameEn: "Tax Services", description: "الإقرارات الضريبية وشهادات المخالصة", descriptionEn: "Tax filing assistance and tax clearance certificates", icon: "receipt" },
  ];

  const BRANCHES = [
    { name: "المقر الرئيسي", nameEn: "Main Government Office", city: "القاهرة", cityEn: "Cairo", address: "15 ميدان التحرير، وسط البلد", addressEn: "15 Tahrir Square, Downtown Cairo" },
    { name: "فرع شمال الدلتا", nameEn: "North District Branch", city: "الإسكندرية", cityEn: "Alexandria", address: "42 طريق الكورنيش، الإسكندرية", addressEn: "42 Corniche Road, Alexandria" },
    { name: "مركز خدمات الجيزة", nameEn: "East Side Service Center", city: "الجيزة", cityEn: "Giza", address: "88 شارع الأهرام، الجيزة", addressEn: "88 Pyramids Street, Giza" },
    { name: "الفرع الإقليمي", nameEn: "Central Hub", city: "المنصورة", cityEn: "Mansoura", address: "7 شارع الجمهورية، المنصورة", addressEn: "7 El-Gomhoreya St, Mansoura" },
  ];

  const services = await Service.insertMany(SERVICES);

  for (const service of services) {
    const branchDocs = BRANCHES.map((b) => ({ ...b, serviceId: service._id }));
    const branches = await Branch.insertMany(branchDocs);

    for (const branch of branches) {
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

      for (let d = 1; d <= 14; d++) {
        const date = new Date();
        date.setDate(date.getDate() + d);
        date.setHours(0, 0, 0, 0);
        if (date.getDay() === 5) continue; // Skip Friday

        for (const t of times) {
          slots.push({ branchId: branch._id, date, startTime: t.start, endTime: t.end, capacity: 3, bookedCount: 0 });
        }
      }
      await Slot.insertMany(slots);
    }
  }

  console.log("Database seeded successfully!");
}

module.exports = connectDB;

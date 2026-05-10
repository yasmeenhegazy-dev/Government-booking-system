const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Persistent local data directory — survives server restarts.
// Using mongodb-memory-server's bundled binary so the user doesn't need
// to install MongoDB. Standalone mode supports dbPath persistence cleanly.
const DATA_DIR = path.resolve(__dirname, "..", "data", "mongo");

let mongod;

const connectDB = async () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    console.log(`Starting MongoDB with persistent storage at ${DATA_DIR}...`);

    mongod = await MongoMemoryServer.create({
      instance: {
        dbName: "gov_booking",
        dbPath: DATA_DIR,
        storageEngine: "wiredTiger",
      },
    });

    const uri = mongod.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host} (persistent at ${DATA_DIR})`);

    await seedDatabase();

    const shutdown = async () => {
      try {
        await mongoose.disconnect();
        if (mongod) await mongod.stop({ doCleanup: false, force: false });
      } catch (e) {
        console.error("Shutdown error:", e.message);
      } finally {
        process.exit(0);
      }
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

async function seedDatabase() {
  const Service = require("../models/Service");
  const Branch = require("../models/Branch");
  const Slot = require("../models/Slot");
  const Employee = require("../models/Employee");

  const existingServices = await Service.countDocuments();
  if (existingServices > 0) {
    console.log("Database already seeded — skipping core seed.");
    // Always run employee seed — it's idempotent (skips existing codes)
    // so new branch assignments get added on the next restart.
    await seedEmployees();
    return;
  }

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

      // Include today (d=0) so the employee dashboard has data on day-1
      for (let d = 0; d <= 14; d++) {
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

  await seedEmployees();

  console.log("Database seeded successfully!");
}

async function seedEmployees() {
  const Branch = require("../models/Branch");
  const Employee = require("../models/Employee");

  // One employee per distinct branch *name* (since branches repeat across services).
  // Idempotent: only inserts missing codes, so re-running adds new ones safely.
  const ASSIGNMENTS = [
    { code: "EMP-001", name: "منة فرحاتي", email: "menna.farhati@gov.eg", role: "employee", branchName: "المقر الرئيسي" },
    { code: "EMP-002", name: "أحمد علي", email: "ahmed.ali@gov.eg", role: "manager", branchName: "المقر الرئيسي" },
    { code: "EMP-003", name: "سارة محمود", email: "sara.mahmoud@gov.eg", role: "employee", branchName: "مركز خدمات الجيزة" },
    { code: "EMP-004", name: "ليلى إبراهيم", email: "layla.ibrahim@gov.eg", role: "employee", branchName: "فرع شمال الدلتا" },
    { code: "EMP-005", name: "ياسين عمر", email: "yassin.omar@gov.eg", role: "manager", branchName: "الفرع الإقليمي" },
  ];

  let added = 0;
  for (const a of ASSIGNMENTS) {
    const existing = await Employee.findOne({ employeeCode: a.code });
    if (existing) continue;
    const branch = await Branch.findOne({ name: a.branchName });
    if (!branch) continue;
    await Employee.create({
      employeeCode: a.code,
      name: a.name,
      email: a.email,
      role: a.role,
      branchId: branch._id,
    });
    added += 1;
  }

  if (added > 0) {
    console.log(`Seeded ${added} new employees. Total codes available:`);
    const all = await Employee.find().populate("branchId", "name").sort({ employeeCode: 1 });
    all.forEach((e) =>
      console.log(`  • ${e.employeeCode} — ${e.name} @ ${e.branchId?.name || "?"} (${e.role})`)
    );
  }
}

module.exports = connectDB;

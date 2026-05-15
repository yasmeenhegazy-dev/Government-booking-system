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

// eslint-disable-next-line no-unused-vars
async function seedDemoAppointments_DISABLED() {
  const Appointment = require("../models/Appointment");
  const Slot = require("../models/Slot");
  const Branch = require("../models/Branch");

  const branches = await Branch.find({ name: "المقر الرئيسي" });
  if (branches.length === 0) return;
  const branchIds = branches.map((b) => b._id);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Skip only if today already has appointments at this branch.
  const todaySlotIds = await Slot.find({
    branchId: { $in: branchIds },
    date: { $gte: today, $lt: tomorrow },
  }).distinct("_id");
  const existingToday = await Appointment.countDocuments({
    slotId: { $in: todaySlotIds },
  });
  console.log(`[demo-seed] today appts at المقر الرئيسي: ${existingToday}`);
  if (existingToday > 0) return;

  let slots = await Slot.find({
    branchId: { $in: branchIds },
    date: { $gte: today, $lt: tomorrow },
    bookedCount: { $lt: 3 },
  }).limit(5);

  // No slots for today → create a small set so the dashboard has data.
  if (slots.length === 0) {
    const times = [
      { start: "09:00", end: "09:30" },
      { start: "10:00", end: "10:30" },
      { start: "11:00", end: "11:30" },
      { start: "13:00", end: "13:30" },
    ];
    const newSlots = branchIds.flatMap((bid) =>
      times.map((t) => ({
        branchId: bid,
        date: today,
        startTime: t.start,
        endTime: t.end,
        capacity: 3,
        bookedCount: 0,
        isActive: true,
      }))
    );
    await Slot.insertMany(newSlots);
    slots = await Slot.find({
      branchId: { $in: branchIds },
      date: { $gte: today, $lt: tomorrow },
      bookedCount: { $lt: 3 },
    }).limit(5);
    console.log(`Created ${newSlots.length} today slots at المقر الرئيسي.`);
  }

  if (slots.length === 0) {
    console.log("Could not seed demo appointments — no slots available.");
    return;
  }

  const DEMO = [
    { name: "محمد إبراهيم", email: "mohamed.demo@example.com", phone: "01012345678", nid: "29501010012001" },
    { name: "فاطمة عبد الله", email: "fatma.demo@example.com", phone: "01112345678", nid: "29501010012002" },
    { name: "خالد سعيد", email: "khaled.demo@example.com", phone: "01212345678", nid: "29501010012003" },
    { name: "نور أحمد", email: "noor.demo@example.com", phone: "01512345678", nid: "29501010012004" },
  ];

  let added = 0;
  for (let i = 0; i < Math.min(DEMO.length, slots.length); i++) {
    const slot = slots[i];
    const d = DEMO[i];
    await Appointment.create({
      serviceId: (await Branch.findById(slot.branchId)).serviceId,
      branchId: slot.branchId,
      slotId: slot._id,
      citizenName: d.name,
      citizenEmail: d.email,
      citizenPhone: d.phone,
      nationalId: d.nid,
    });
    await Slot.findByIdAndUpdate(slot._id, { $inc: { bookedCount: 1 } });
    added += 1;
  }

  if (added > 0) {
    console.log(`Seeded ${added} demo appointments for today at المقر الرئيسي.`);
  }
}

async function seedEmployees() {
  const Branch = require("../models/Branch");
  const Employee = require("../models/Employee");
  const User = require("../models/User");

  // One employee per distinct branch *name* (since branches repeat across services).
  // Idempotent: only inserts missing codes, so re-running adds new ones safely.
  // nationalId + password let the same person log in through /api/auth/login.
  const ASSIGNMENTS = [
    { code: "EMP-001", firstName: "منة", lastName: "فرحاتي", email: "menna.farhati@gov.eg", nationalId: "30001010100001", role: "employee", branchName: "المقر الرئيسي" },
    { code: "EMP-002", firstName: "أحمد", lastName: "علي", email: "ahmed.ali@gov.eg", nationalId: "30001010100002", role: "manager", branchName: "المقر الرئيسي" },
    { code: "EMP-003", firstName: "سارة", lastName: "محمود", email: "sara.mahmoud@gov.eg", nationalId: "30001010100003", role: "employee", branchName: "مركز خدمات الجيزة" },
    { code: "EMP-004", firstName: "ليلى", lastName: "إبراهيم", email: "layla.ibrahim@gov.eg", nationalId: "30001010100004", role: "employee", branchName: "فرع شمال الدلتا" },
    { code: "EMP-005", firstName: "ياسين", lastName: "عمر", email: "yassin.omar@gov.eg", nationalId: "30001010100005", role: "manager", branchName: "الفرع الإقليمي" },
  ];

  const DEFAULT_PASSWORD = "Employee@123";

  let addedEmployees = 0;
  let addedUsers = 0;
  for (const a of ASSIGNMENTS) {
    const branch = await Branch.findOne({ name: a.branchName });
    if (!branch) continue;

    const existingEmp = await Employee.findOne({ employeeCode: a.code });
    if (!existingEmp) {
      await Employee.create({
        employeeCode: a.code,
        name: `${a.firstName} ${a.lastName}`,
        email: a.email,
        role: a.role === "manager" ? "manager" : "employee",
        branchId: branch._id,
      });
      addedEmployees += 1;
    }

    const existingUser = await User.findOne({ email: a.email });
    if (!existingUser) {
      await User.create({
        firstName: a.firstName,
        lastName: a.lastName,
        email: a.email,
        password: DEFAULT_PASSWORD,
        nationalId: a.nationalId,
        role: "employee",
      });
      addedUsers += 1;
    }
  }

  if (addedEmployees > 0 || addedUsers > 0) {
    console.log(`Seeded ${addedEmployees} employees and ${addedUsers} user accounts.`);
    console.log(`Default employee login password: ${DEFAULT_PASSWORD}`);
    const all = await Employee.find().populate("branchId", "name").sort({ employeeCode: 1 });
    all.forEach((e) =>
      console.log(`  • ${e.employeeCode} — ${e.name} (${e.email}) @ ${e.branchId?.name || "?"} (${e.role})`)
    );
  }
}

module.exports = connectDB;

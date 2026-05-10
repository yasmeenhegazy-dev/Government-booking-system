// End-to-end demo: Shahd books → employee sees pending → scans QR → both sides update
const API = "http://localhost:5000/api";

async function call(method, path, body) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(API + path, opts);
  return { status: r.status, body: await r.json() };
}

function localDay(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

(async () => {
  console.log("\n=== سيناريو: شهد تحجز والموظف يشوفها ويمسح QR ===\n");

  const emp = (await call("POST", "/employees/login", { employeeCode: "EMP-001" })).body;
  const empId = emp.data._id;
  const brId = emp.data.branch._id;

  const services = (await call("GET", "/services")).body;
  const svcId = services.data[0]._id;
  const slots = (await call("GET", `/slots?branchId=${brId}`)).body;
  const slot = slots.data.find((s) => s.bookedCount === 0);
  const slotDay = localDay(new Date(slot.date));

  console.log(`🪑  شهد بتختار: خدمة "${services.data[0].name}"`);
  console.log(`    فرع: "${emp.data.branch.name}" — موعد: ${slotDay} الساعة ${slot.startTime}\n`);

  const SHAHD_NID = "29812121234567";
  const created = (
    await call("POST", "/appointments", {
      serviceId: svcId,
      branchId: brId,
      slotId: slot._id,
      citizenName: "شهد العربي",
      citizenEmail: "shahd@gov.eg",
      citizenPhone: "01099887766",
      nationalId: SHAHD_NID,
    })
  ).body;
  const ref = created.data.bookingReference;
  console.log(`🧾  شهد أكدت الحجز (POST /api/appointments)`);
  console.log(`    ✓ الـ DB حفظ: ref=${ref} | status=${created.data.status} (= في الانتظار)\n`);

  const today1 = (await call("GET", `/appointments/today?branchId=${brId}&date=${slotDay}`)).body;
  const shahdRow = today1.data.find((a) => a.bookingReference === ref);
  console.log(`👨‍💼  الموظف منة فتح dashboard اليوم ${slotDay}:`);
  console.log(`    📊 stats: ${JSON.stringify(today1.stats)}`);
  if (shahdRow) {
    console.log(`    ✓ شهد ظاهرة في القائمة:`);
    console.log(`       الاسم: ${shahdRow.citizenName}`);
    console.log(`       الخدمة: ${shahdRow.serviceId.name}`);
    console.log(`       الوقت: ${shahdRow.slotId.startTime}-${shahdRow.slotId.endTime}`);
    console.log(`       الحالة: ${shahdRow.status} ← تحت "في الانتظار"\n`);
  }

  const qrPayload = { ref, nid: SHAHD_NID, sid: svcId, bid: brId, slot: slot._id };
  console.log(`📷  شهد فتحت /citizen/confirmation`);
  console.log(`    QR JSON: ${JSON.stringify(qrPayload)}\n`);

  const verify = (await call("POST", "/appointments/verify-qr", { employeeId: empId, qrPayload })).body;
  console.log(`📱  الموظف صوّر الـ QR (POST /api/appointments/verify-qr)`);
  console.log(`    ✓ ${verify.message}`);
  console.log(`       status بقت: ${verify.data.status} | verifiedAt: ${verify.data.verifiedAt}\n`);

  const today2 = (await call("GET", `/appointments/today?branchId=${brId}&date=${slotDay}`)).body;
  const shahdRow2 = today2.data.find((a) => a.bookingReference === ref);
  console.log(`🔄  dashboard الموظف بعد المسح:`);
  console.log(`    📊 stats: ${JSON.stringify(today2.stats)} ← verified زادت`);
  console.log(`    ✓ شهد بقت تحت "تم التحقق" — status: ${shahdRow2.status}\n`);

  const shahdView = (await call("GET", `/appointments/user?nationalId=${SHAHD_NID}`)).body;
  const myBooking = shahdView.data.find((a) => a.bookingReference === ref);
  console.log(`👤  شهد رجعت لـ /citizen/dashboard:`);
  console.log(`    ✓ status عندها: ${myBooking.status} (نفس الـ DB — نفس التحديث)\n`);

  console.log("=== ✅ الـ pipeline متكامل: حجز ← يظهر للموظف ← يمسح QR ← الكل يتحدّث ===");
})().catch((e) => {
  console.error("FAIL:", e.message);
  process.exit(1);
});

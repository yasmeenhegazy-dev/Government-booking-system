# دليل النشر على Railway

نشر المشروع كخدمة واحدة على Railway مع MongoDB Atlas (مجاني).
الـ backend بيقدم الـ frontend بعد ما Vite يعمل build، فلينك واحد بس بيشتغل من الموبايل ومن الكمبيوتر.

---

## الخطوة 1 — إنشاء قاعدة بيانات MongoDB Atlas (مجاني)

1. روح [cloud.mongodb.com](https://cloud.mongodb.com) واعملي حساب.
2. اضغطي **Build a Database** → اختاري **M0 (Free)**.
3. اختاري Provider/Region (أي واحد قريب — مثلاً AWS Frankfurt).
4. في **Database Access**:
   - أنشئي مستخدم جديد (مثلاً `gov_admin`).
   - اعملي **Autogenerate Secure Password** واحفظي الباسورد في مكان آمن.
   - الصلاحيات: **Read and write to any database**.
5. في **Network Access**:
   - اضغطي **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`).
   - دي ضرورية لإن Railway مالوش IP ثابت.
6. ارجعي لـ **Database** → اضغطي **Connect** على الـ cluster بتاعك.
   - اختاري **Drivers** → Node.js.
   - انسخي الـ connection string، شكله كده:
     ```
     mongodb+srv://gov_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - بدّلي `<password>` بالباسورد الفعلي.
   - ضيفي اسم القاعدة قبل علامة الاستفهام: `/gov_booking?`
     ```
     mongodb+srv://gov_admin:realpassword@cluster0.xxxxx.mongodb.net/gov_booking?retryWrites=true&w=majority
     ```
   - احفظي السترينج دي، هنستخدمها في Railway.

---

## الخطوة 2 — رفع التعديلات الأخيرة على GitHub

من ترمنال المشروع:

```powershell
git add .
git commit -m "Add Railway deploy config and Atlas support"
git push origin main
```

---

## الخطوة 3 — إنشاء مشروع على Railway

1. روحي [railway.app](https://railway.app) وسجلي بحساب GitHub.
2. اضغطي **New Project** → **Deploy from GitHub repo**.
3. وافقي على وصول Railway للـ repo بتاعك → اختاري `Government-Booking-System`.
4. Railway هيبدأ build تلقائي. ممكن يفشل أول مرة لإن متغيرات البيئة لسة مش متظبطة — مش مشكلة.

---

## الخطوة 4 — ضبط متغيرات البيئة على Railway

في الـ service بتاعك على Railway، روحي تاب **Variables** وضيفي:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | الـ connection string من Atlas |
| `ALLOWED_ORIGINS` | (هنضيفها بعد ما نجيب اللينك — الخطوة 6) |

(لو هتستخدمي إيميلات: ضيفي كمان `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.)

**ملاحظة:** متضيفيش `PORT` — Railway بيوفّره تلقائيًا.

---

## الخطوة 5 — تفعيل لينك عام (Public Domain)

1. في الـ service، تاب **Settings** → قسم **Networking** → اضغطي **Generate Domain**.
2. Railway هيدّيكي رابط زي:
   ```
   gov-booking-production.up.railway.app
   ```
3. انسخي الرابط ده.

---

## الخطوة 6 — إضافة الرابط لـ ALLOWED_ORIGINS

1. ارجعي لـ **Variables**.
2. عدّلي `ALLOWED_ORIGINS` وحطي الرابط بتاعك مع `https://`:
   ```
   https://gov-booking-production.up.railway.app
   ```
3. Railway هيعمل redeploy تلقائي.

---

## الخطوة 7 — افتحي اللينك من الموبايل

استني من 1 لـ 3 دقايق لحد ما الـ build يخلص (هتشوفي logs في تاب **Deployments**)، وبعدها افتحي اللينك من الموبايل.

الموقع المفروض يفتح على الصفحة الرئيسية، تقدري:
- تسجلي حساب جديد كمواطن.
- تدخلي بحسابات الموظفين الموجودين (الإيميلات في الـ seed، الباسورد: `Employee@123`).

---

## استكشاف الأخطاء

### الـ build بيفشل في install
- روحي **Deployments** → اضغطي على آخر deployment → شوفي الـ logs.
- لو رسالة عن `npm install` ساقطة، اعملي **Redeploy** من نفس الصفحة.

### الموقع بيفتح بس البيانات مش بتظهر
- جربي افتحي `https://your-link/api/health` — لازم يرجع `{"status":"ok"}`.
- لو رجع 500: تأكدي إن `MONGODB_URI` صح ومش فيه مسافات.
- لو رجع 403 CORS: تأكدي إن `ALLOWED_ORIGINS` نفس اللينك بالظبط (مع `https://` ومن غير سلاش في الآخر).

### Atlas IP whitelist
- لو رسالة `Could not connect to any servers`: راجعي **Network Access** في Atlas، لازم يكون فيها `0.0.0.0/0`.

### المشروع شغال لكن الـ DB فاضي
- المرة الأولى بياخد وقت في الـ seeding (~10–20 ثانية).
- لو بعد دقيقة لسة فاضي، شوفي logs في Railway — المفروض تلاقي سطر `Database seeded successfully!`.

---

## للتطوير المحلي بعد التعديلات

كل شيء لسة شغّال زي الأول:
```powershell
# Backend
cd backend
npm install
npm run dev          # http://localhost:5000

# Frontend (في ترمنال تاني)
cd frontend
npm install
npm run dev          # http://localhost:3000
```

من غير `MONGODB_URI` في الـ `.env`، الـ backend بيرجع تلقائيًا لـ `mongodb-memory-server` المحلي زي الأول.

import { UserCog, ShieldCheck, Mail, KeyRound, Building2 } from "lucide-react";

export default function AdminProfile() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-500 flex items-center gap-2">
          <UserCog className="h-6 w-6 text-gold-600" strokeWidth={1.75} />
          الملف الشخصي للمسؤول
        </h1>
        <p className="text-slate-500 text-sm mt-1">بيانات حساب الإدارة المتقدمة</p>
      </div>

      <div className="card-standard mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-navy-500 flex items-center justify-center text-2xl font-bold shadow-gov">
            مس
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-navy-500">مسؤول النظام</h2>
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border bg-gold-50 text-gold-700 border-gold-200 inline-flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" strokeWidth={2} />
                Admin
              </span>
            </div>
            <p className="text-sm text-slate-500" dir="ltr">admin@gov.eg</p>
            <p className="text-xs text-slate-400 mt-1">الإدارة المتقدمة — جزء 6</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="card-standard">
          <h3 className="font-bold text-navy-500 mb-4 flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-gold-600" strokeWidth={1.75} />
            صلاحيات الحساب
          </h3>
          <ul className="space-y-2 text-sm">
            <Perm label="عرض لوحة الإحصائيات" />
            <Perm label="تشغيل التقارير اليومية والشهرية" />
            <Perm label="إدارة سعة المواعيد وتفعيلها" />
            <Perm label="عرض جميع الحجوزات في النظام" />
            <Perm label="مراقبة سجل النشاط" />
            <Perm label="إدارة المستخدمين والخدمات والفروع والأدوار" />
          </ul>
        </section>

        <section className="card-standard">
          <h3 className="font-bold text-navy-500 mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gold-600" strokeWidth={1.75} />
            نطاق العمل
          </h3>
          <dl className="space-y-3 text-sm">
            <Field icon={Building2} label="النطاق" value="كل الفروع" />
            <Field icon={Mail} label="البريد الإلكتروني" value="admin@gov.eg" dir="ltr" />
            <Field icon={ShieldCheck} label="مستوى الوصول" value="مسؤول كامل" />
          </dl>
        </section>
      </div>
    </div>
  );
}

function Perm({ label }) {
  return (
    <li className="flex items-center gap-2 text-slate-700">
      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 inline-flex items-center justify-center text-xs">
        ✓
      </span>
      {label}
    </li>
  );
}

function Field({ icon: Icon, label, value, dir }) {
  return (
    <div>
      <dt className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
        {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />}
        {label}
      </dt>
      <dd
        className="font-medium text-navy-600 text-sm bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-100"
        dir={dir}
      >
        {value}
      </dd>
    </div>
  );
}

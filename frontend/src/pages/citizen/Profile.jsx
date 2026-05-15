import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  IdCard,
  Calendar,
  CheckCircle2,
  XCircle,
  TrendingUp,
  LogOut,
  Plus,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { useCitizenSession } from "../../lib/citizenAuth.js";

export default function CitizenProfile() {
  const { session, appointments, loading, logout } = useCitizenSession();

  const stats = useMemo(() => {
    const total = appointments.length;
    const confirmed = appointments.filter((a) => a.status === "confirmed").length;
    const completed = appointments.filter(
      (a) => a.status === "completed" || a.status === "verified"
    ).length;
    const cancelled = appointments.filter((a) => a.status === "cancelled").length;
    const memberSince = appointments.length
      ? new Date(
          Math.min(...appointments.map((a) => new Date(a.createdAt).getTime()))
        )
      : null;
    return { total, confirmed, completed, cancelled, memberSince };
  }, [appointments]);

  if (loading && !session) {
    return <LoadingSpinner message="جاري تحميل الملف الشخصي..." />;
  }

  const initials = (session?.citizenName || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("");

  return (
    <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy-500">الملف الشخصي</h1>
          <p className="text-slate-500 text-sm mt-1">
            بيانات حسابك وإحصائيات حجوزاتك مع البوابة
          </p>
        </div>

        {/* Profile header card */}
        <div className="card-standard mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-navy-500 flex items-center justify-center text-2xl font-bold shadow-gov">
              {initials || "م"}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-navy-500">{session?.citizenName || "—"}</h2>
              <p className="text-sm text-slate-500" dir="ltr">{session?.citizenEmail}</p>
              {stats.memberSince && (
                <p className="text-xs text-slate-400 mt-1">
                  عضو منذ {formatDate(stats.memberSince)}
                </p>
              )}
            </div>
            <button
              onClick={logout}
              className="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm hover:bg-red-50 transition"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* Personal info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 card-standard">
            <h3 className="font-bold text-navy-500 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-gold-600" strokeWidth={1.75} />
              البيانات الشخصية
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <Field icon={User} label="الاسم الكامل" value={session?.citizenName} />
              <Field
                icon={IdCard}
                label="الرقم القومي"
                value={session?.nationalId}
                dir="ltr"
              />
              <Field
                icon={Mail}
                label="البريد الإلكتروني"
                value={session?.citizenEmail}
                dir="ltr"
              />
              <Field
                icon={Phone}
                label="رقم الهاتف"
                value={session?.citizenPhone}
                dir="ltr"
              />
            </dl>

            <div className="mt-5 pt-5 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
              <p>
                لتحديث بياناتك الشخصية، يتم تحديثها تلقائياً عند إجراء حجز جديد بهذه البيانات.
                للتغييرات الجوهرية يرجى مراجعة أقرب فرع.
              </p>
            </div>
          </section>

          {/* Stats */}
          <section className="card-standard">
            <h3 className="font-bold text-navy-500 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gold-600" strokeWidth={1.75} />
              ملخص النشاط
            </h3>
            <div className="space-y-3">
              <StatRow
                label="إجمالي الحجوزات"
                value={stats.total}
                icon={Calendar}
                color="text-navy-500"
              />
              <StatRow
                label="نشطة (مؤكدة)"
                value={stats.confirmed}
                icon={Calendar}
                color="text-blue-600"
              />
              <StatRow
                label="منجزة"
                value={stats.completed}
                icon={CheckCircle2}
                color="text-green-600"
              />
              <StatRow
                label="ملغاة"
                value={stats.cancelled}
                icon={XCircle}
                color="text-red-600"
              />
            </div>

            <Link
              to="/"
              className="btn-primary w-full mt-5 inline-flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" strokeWidth={1.75} />
              حجز موعد جديد
            </Link>
          </section>
        </div>
    </div>
  );
}

function Field({ icon: Icon, label, value, dir }) {
  return (
    <div>
      <dt className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
        {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />}
        {label}
      </dt>
      <dd className="font-medium text-navy-600 text-sm bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-100" dir={dir}>
        {value || "—"}
      </dd>
    </div>
  );
}

function StatRow({ label, value, icon: Icon, color }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Icon className={`h-4 w-4 ${color}`} strokeWidth={1.75} />
        {label}
      </div>
      <div className={`font-bold text-lg ${color}`}>{value}</div>
    </div>
  );
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

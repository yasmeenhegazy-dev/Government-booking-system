import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  UserCog,
  Mail,
  Building,
  MapPin,
  ShieldCheck,
  TrendingUp,
  LogOut,
  ScanLine,
  KeyRound,
  Calendar,
  CheckCircle2,
  Hourglass,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { useEmployeeSession } from "../../lib/employeeAuth.js";
import { getAllUpcomingAppointments } from "../../lib/api.js";

export default function EmployeeProfile() {
  const { session, loading: sessionLoading, logout } = useEmployeeSession();
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.branch?._id) return;
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const result = await getAllUpcomingAppointments();
        if (!cancelled) setToday(result);
      } catch {
        // Non-blocking — profile shows fine without stats
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [session?.branch?._id]);

  if (sessionLoading) {
    return <LoadingSpinner message="جاري التحميل..." />;
  }

  const initials = (session?.name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("");

  const stats = today?.stats || { total: 0, pending: 0, verified: 0, completed: 0, cancelled: 0 };
  const checkedIn = stats.verified + stats.completed;
  const completionRate = stats.total ? Math.round((checkedIn / stats.total) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy-500 flex items-center gap-2">
            <UserCog className="h-6 w-6 text-gold-600" strokeWidth={1.75} />
            الملف الشخصي
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            بيانات حسابك ومركز عملك ونظرة على الحجوزات
          </p>
        </div>

        {/* Profile header */}
        <div className="card-standard mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-navy-500 flex items-center justify-center text-2xl font-bold shadow-gov">
              {initials || "م"}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-navy-500">{session?.name || "—"}</h2>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border bg-gold-50 text-gold-700 border-gold-200">
                  {session?.role === "manager" ? "مدير" : "موظف"}
                </span>
              </div>
              <p className="text-sm text-slate-500" dir="ltr">{session?.email || "—"}</p>
              <div className="text-xs text-slate-400 mt-1 inline-flex items-center gap-1.5">
                <KeyRound className="h-3 w-3" strokeWidth={2} />
                <span dir="ltr">{session?.employeeCode}</span>
              </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Branch info */}
          <section className="lg:col-span-2 card-standard">
            <h3 className="font-bold text-navy-500 mb-4 flex items-center gap-2">
              <Building className="h-5 w-5 text-gold-600" strokeWidth={1.75} />
              مركز العمل
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <Field icon={Building} label="اسم الفرع" value={session?.branch?.name} />
              <Field icon={MapPin} label="المدينة" value={session?.branch?.city} />
              <div className="sm:col-span-2">
                <Field icon={MapPin} label="العنوان" value={session?.branch?.address} />
              </div>
              <Field icon={KeyRound} label="كود الموظف" value={session?.employeeCode} dir="ltr" />
              <Field icon={Mail} label="البريد الإلكتروني" value={session?.email} dir="ltr" />
            </dl>

            <div className="mt-5 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <Link
                to="/employee/scan"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-navy-500 text-sm font-bold transition"
              >
                <ScanLine className="h-4 w-4" strokeWidth={2} />
                فتح ماسح QR
              </Link>
              <Link
                to="/employee/appointments"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 hover:border-navy-300 text-navy-500 text-sm font-semibold transition"
              >
                <Calendar className="h-4 w-4" strokeWidth={1.75} />
                المراجعة اليومية
              </Link>
            </div>
          </section>

          {/* Stats */}
          <section className="card-standard">
            <h3 className="font-bold text-navy-500 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gold-600" strokeWidth={1.75} />
              نظرة عامة
            </h3>

            {loading ? (
              <div className="py-6 text-center text-sm text-slate-400">جاري التحميل...</div>
            ) : (
              <div className="space-y-3">
                <StatRow
                  label="إجمالي الحجوزات"
                  value={stats.total}
                  icon={Calendar}
                  color="text-navy-500"
                />
                <StatRow
                  label="في الانتظار"
                  value={stats.pending}
                  icon={Hourglass}
                  color="text-amber-600"
                />
                <StatRow
                  label="تم التحقق"
                  value={checkedIn}
                  icon={ShieldCheck}
                  color="text-emerald-600"
                />
                <StatRow
                  label="ملغي"
                  value={stats.cancelled}
                  icon={CheckCircle2}
                  color="text-red-600"
                />

                <div className="pt-3 mt-3 border-t border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">معدل الإنجاز</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-navy-500">{completionRate}%</span>
                    <span className="text-xs text-slate-400">
                      {completionRate >= 80
                        ? "ممتاز"
                        : completionRate >= 50
                        ? "جيد"
                        : "بحاجة للتحسين"}
                    </span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold-400 to-emerald-500 transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
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
      <dd
        className="font-medium text-navy-600 text-sm bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-100"
        dir={dir}
      >
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


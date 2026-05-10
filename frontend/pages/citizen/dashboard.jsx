import { useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Hourglass,
  TrendingUp,
  Plus,
  MapPin,
  ArrowLeft,
  QrCode,
} from "lucide-react";
import CitizenLayout from "../../components/CitizenLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import { useCitizenSession } from "../../lib/citizenAuth";

const STATUS_LABEL = {
  confirmed: { label: "مؤكد", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  cancelled: { label: "ملغي", cls: "bg-red-50 text-red-700 border-red-200" },
  completed: { label: "منجز", cls: "bg-green-50 text-green-700 border-green-200" },
  verified: { label: "تم التحقق", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

export default function CitizenDashboard() {
  const { session, appointments, loading, error, refresh, logout } = useCitizenSession();

  const stats = useMemo(() => {
    const total = appointments.length;
    const upcoming = appointments.filter(
      (a) => a.status === "confirmed" && new Date(a.slotId?.date) >= startOfToday()
    ).length;
    const completed = appointments.filter(
      (a) => a.status === "completed" || a.status === "verified"
    ).length;
    const cancelled = appointments.filter((a) => a.status === "cancelled").length;
    return { total, upcoming, completed, cancelled };
  }, [appointments]);

  const upcomingList = useMemo(() => {
    return appointments
      .filter((a) => a.status === "confirmed" && new Date(a.slotId?.date) >= startOfToday())
      .sort((a, b) => new Date(a.slotId?.date) - new Date(b.slotId?.date))
      .slice(0, 5);
  }, [appointments]);

  if (loading && !session) {
    return (
      <CitizenLayout citizen={null} onLogout={logout}>
        <LoadingSpinner message="جاري تحميل لوحة التحكم..." />
      </CitizenLayout>
    );
  }

  return (
    <CitizenLayout citizen={session} onLogout={logout}>
      <div className="max-w-6xl mx-auto">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-500">
            مرحباً بك، {session?.citizenName || "مواطن"} 👋
          </h1>
          <p className="text-slate-500 mt-1">إدارة حجوزاتك ومتابعة المواعيد القادمة</p>
        </div>

        {error && <div className="mb-6"><ErrorMessage message={error} onRetry={() => refresh()} /></div>}

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="إجمالي الحجوزات"
            value={stats.total}
            icon={Calendar}
            color="navy"
            border="border-navy-300"
          />
          <StatCard
            label="القادمة"
            value={stats.upcoming}
            icon={Hourglass}
            color="gold"
            border="border-gold-300"
          />
          <StatCard
            label="المنجزة"
            value={stats.completed}
            icon={CheckCircle2}
            color="green"
            border="border-green-300"
          />
          <StatCard
            label="الملغاة"
            value={stats.cancelled}
            icon={XCircle}
            color="red"
            border="border-red-300"
          />
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <QuickAction
            href="/"
            icon={Plus}
            title="حجز موعد جديد"
            subtitle="ابدأ حجز خدمة حكومية"
            color="bg-navy-500 hover:bg-navy-600 text-white"
          />
          <QuickAction
            href="/citizen/appointments"
            icon={Calendar}
            title="إدارة الحجوزات"
            subtitle="عرض وإلغاء الحجوزات"
            color="bg-white border border-slate-200 hover:border-gold-400 text-navy-500"
          />
          <QuickAction
            href="/citizen/confirmation"
            icon={QrCode}
            title="رمز QR للحضور"
            subtitle="عرض كود الحجز القادم"
            color="bg-gold-500 hover:bg-gold-600 text-navy-500"
          />
        </div>

        {/* Upcoming appointments */}
        <section className="card-standard">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-navy-500">الحجوزات القادمة</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                أقرب {upcomingList.length} مواعيد
              </p>
            </div>
            <Link
              href="/citizen/appointments"
              className="text-sm text-gold-600 hover:text-gold-700 font-semibold flex items-center gap-1"
            >
              عرض الكل
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </div>

          {upcomingList.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Calendar className="h-10 w-10 mx-auto text-slate-300 mb-3" strokeWidth={1.5} />
              <p className="text-sm">لا توجد حجوزات قادمة</p>
              <Link href="/" className="btn-primary inline-flex items-center gap-2 mt-4">
                <Plus className="h-4 w-4" strokeWidth={1.75} />
                احجز موعدك الآن
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-start text-xs text-slate-500 border-b border-slate-200">
                    <th className="text-start font-medium py-3">الخدمة</th>
                    <th className="text-start font-medium py-3 hidden sm:table-cell">الفرع</th>
                    <th className="text-start font-medium py-3">التاريخ</th>
                    <th className="text-start font-medium py-3">التوقيت</th>
                    <th className="text-start font-medium py-3">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingList.map((apt) => (
                    <tr key={apt._id} className="border-b border-slate-100 last:border-0">
                      <td className="py-3 font-medium text-navy-600">
                        {apt.serviceId?.name || "—"}
                      </td>
                      <td className="py-3 text-slate-600 hidden sm:table-cell">
                        {apt.branchId?.name || "—"}
                      </td>
                      <td className="py-3 text-slate-600">{formatDate(apt.slotId?.date)}</td>
                      <td className="py-3 text-slate-600" dir="ltr">
                        {apt.slotId?.startTime}
                      </td>
                      <td className="py-3">
                        <StatusBadge status={apt.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </CitizenLayout>
  );
}

function StatCard({ label, value, icon: Icon, border }) {
  return (
    <div className={`card-standard border-s-4 ${border}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-3xl font-bold text-navy-500 mt-2">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}

function QuickAction({ href, icon: Icon, title, subtitle, color }) {
  return (
    <Link
      href={href}
      className={`rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 shadow-gov flex items-center gap-4 ${color}`}
    >
      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </div>
      <div className="text-start">
        <h3 className="font-bold text-base leading-tight">{title}</h3>
        <p className="text-xs opacity-80 mt-0.5">{subtitle}</p>
      </div>
    </Link>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_LABEL[status] || STATUS_LABEL.confirmed;
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}
    >
      {cfg.label}
    </span>
  );
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("ar-EG", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

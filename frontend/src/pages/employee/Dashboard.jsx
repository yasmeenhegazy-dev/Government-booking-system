import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Hourglass,
  ShieldCheck,
  TrendingUp,
  ScanLine,
  ClipboardList,
  Users,
  Clock,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import { useEmployeeSession } from "../../lib/employeeAuth.js";
import { getAllUpcomingAppointments } from "../../lib/api.js";

const STATUS_LABEL = {
  confirmed: { label: "في الانتظار", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  verified: { label: "تم التحقق", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  completed: { label: "منجز", cls: "bg-green-50 text-green-700 border-green-200" },
  cancelled: { label: "ملغي", cls: "bg-red-50 text-red-700 border-red-200" },
};

export default function EmployeeDashboard() {
  const { session, loading: sessionLoading } = useEmployeeSession();
  const [allUpcoming, setAllUpcoming] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session?._id) return;
    let cancelled = false;

    async function load(isInitial) {
      try {
        if (isInitial) setLoading(true);
        setError(null);
        const upcomingResult = await getAllUpcomingAppointments();
        if (!cancelled) setAllUpcoming(upcomingResult);
      } catch (err) {
        if (!cancelled && isInitial) {
          setError(err?.response?.data?.message || "تعذر تحميل البيانات");
        }
      } finally {
        if (!cancelled && isInitial) setLoading(false);
      }
    }

    load(true);
    // Poll every 15s so new citizen bookings surface without a manual refresh.
    // (Shorter intervals trip the API rate limiter.)
    const interval = setInterval(() => load(false), 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [session?._id]);

  // All hooks must run on every render — keep them above any early return.
  const dateLabel = useMemo(
    () =>
      new Date().toLocaleDateString("ar-EG", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    []
  );
  const weekday = useMemo(
    () => new Date().toLocaleDateString("ar-EG", { weekday: "long" }),
    []
  );

  if (sessionLoading || (!session && loading)) {
    return <LoadingSpinner message="جاري التحميل..." />;
  }

  // Show all-upcoming stats so the dashboard surfaces every citizen booking,
  // not just today at this branch — keeps the demo cohesive when the citizen
  // booked at a different location or date.
  const stats =
    allUpcoming?.stats || { total: 0, pending: 0, verified: 0, completed: 0, cancelled: 0 };
  const completionRate =
    stats.total === 0 ? 0 : Math.round(((stats.verified + stats.completed) / stats.total) * 100);

  const upcoming = (allUpcoming?.data || [])
    .filter((a) => a.status === "confirmed" || a.status === "verified")
    .slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto">
        {/* Welcome banner */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-navy-500">
              لوحة التحكم
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              مرحباً بك مجدداً، <span className="font-semibold text-gold-600">{session?.name}</span> 👋
            </p>
          </div>
          <Link
            to="/employee/scan"
            className="self-start sm:self-end inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-500 text-sm font-bold shadow-gov-lg transition"
          >
            <ScanLine className="h-4 w-4" strokeWidth={2} />
            امسح QR
          </Link>
        </div>

        {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="إجمالي الحجوزات"
            value={stats.total}
            icon={Users}
            border="border-navy-300"
          />
          <StatCard
            label="في الانتظار"
            value={stats.pending}
            icon={Hourglass}
            border="border-amber-300"
          />
          <StatCard
            label="تم التحقق"
            value={stats.verified + stats.completed}
            icon={ShieldCheck}
            border="border-emerald-300"
          />
          <StatCard
            label="معدل الإنجاز"
            value={`${completionRate}%`}
            icon={TrendingUp}
            border="border-violet-300"
            note={completionRate >= 80 ? "ممتاز" : completionRate >= 50 ? "جيد" : "بحاجة للتحسين"}
          />
        </div>

        {/* Calendar + upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Calendar */}
          <div className="card-standard text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center mb-3">
              <Calendar className="h-6 w-6 text-gold-600" strokeWidth={1.75} />
            </div>
            <div className="text-xl font-bold text-navy-500">{weekday}</div>
            <div className="text-sm text-slate-500 mt-1">{dateLabel}</div>
          </div>

          {/* Upcoming */}
          <div className="card-standard lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-navy-500">كل الحجوزات القادمة</h2>
                <p className="text-xs text-slate-500 mt-0.5">{upcoming.length} حجز قادم من كل الفروع</p>
              </div>
              <Link
                to="/employee/appointments"
                className="text-sm text-gold-600 hover:text-gold-700 font-semibold inline-flex items-center gap-1"
              >
                <ClipboardList className="h-4 w-4" strokeWidth={1.75} />
                عرض الكل
              </Link>
            </div>

            {loading ? (
              <LoadingSpinner message="جاري تحميل الحجوزات..." />
            ) : upcoming.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <Calendar className="h-10 w-10 mx-auto text-slate-300 mb-2" strokeWidth={1.5} />
                <p className="text-sm">لا توجد حجوزات قادمة</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-slate-500 border-b border-slate-200">
                      <th className="text-start font-medium py-3">المواطن</th>
                      <th className="text-start font-medium py-3 hidden md:table-cell">الخدمة</th>
                      <th className="text-start font-medium py-3 hidden sm:table-cell">الفرع</th>
                      <th className="text-start font-medium py-3">التاريخ</th>
                      <th className="text-start font-medium py-3">الوقت</th>
                      <th className="text-start font-medium py-3">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcoming.map((apt) => (
                      <tr key={apt._id} className="border-b border-slate-100 last:border-0">
                        <td className="py-3 font-medium text-navy-600">{apt.citizenName}</td>
                        <td className="py-3 text-slate-600 hidden md:table-cell">
                          {apt.serviceId?.name || "—"}
                        </td>
                        <td className="py-3 text-slate-600 hidden sm:table-cell">
                          {apt.branchId?.name || "—"}
                        </td>
                        <td className="py-3 text-slate-600" dir="ltr">
                          {formatShortDate(apt.slotId?.date)}
                        </td>
                        <td className="py-3 text-slate-600 inline-flex items-center gap-1.5" dir="ltr">
                          <Clock className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.75} />
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
          </div>
        </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, border, note }) {
  return (
    <div className={`card-standard border-s-4 ${border}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-3xl font-bold text-navy-500 mt-2">{value}</p>
          {note && <p className="text-[11px] text-slate-400 mt-1">{note}</p>}
        </div>
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_LABEL[status] || STATUS_LABEL.confirmed;
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

function formatShortDate(d) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("ar-EG", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return "—";
  }
}

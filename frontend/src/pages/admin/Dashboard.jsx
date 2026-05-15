import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  CalendarCheck,
  Building2,
  Briefcase,
  ClipboardList,
  Hourglass,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import { getAdminStats } from "../../lib/api.js";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      setError(err?.response?.data?.message || "تعذر تحميل الإحصائيات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingSpinner message="جاري تحميل البيانات..." />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (!stats) return null;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-500">لوحة الإدارة</h1>
        <p className="text-slate-500 mt-1 text-sm">نظرة شاملة على نشاط النظام</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="الخدمات" value={stats.services} icon={Briefcase} border="border-navy-300" />
        <StatCard label="الفروع" value={stats.branches} icon={Building2} border="border-blue-300" />
        <StatCard label="الموظفين" value={stats.employees} icon={Users} border="border-emerald-300" />
        <StatCard label="المستخدمين" value={stats.users} icon={Users} border="border-violet-300" />
        <StatCard label="المواعيد الكلية" value={stats.slots} icon={CalendarCheck} border="border-gold-300" />
      </div>

      {/* Appointments breakdown */}
      <section className="card-standard mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-navy-500 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-gold-600" strokeWidth={1.75} />
            ملخص الحجوزات
          </h2>
          <Link
            to="/admin/appointments"
            className="text-sm text-gold-600 hover:text-gold-700 font-semibold inline-flex items-center gap-1"
          >
            عرض الكل
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <MiniStat label="الإجمالي" value={stats.appointments.total} color="text-navy-500" />
          <MiniStat
            label="في الانتظار"
            value={stats.appointments.pending}
            color="text-amber-600"
            icon={Hourglass}
          />
          <MiniStat
            label="تم التحقق"
            value={stats.appointments.verified}
            color="text-emerald-600"
            icon={CheckCircle2}
          />
          <MiniStat
            label="منجز"
            value={stats.appointments.completed}
            color="text-green-600"
            icon={CheckCircle2}
          />
          <MiniStat
            label="ملغي"
            value={stats.appointments.cancelled}
            color="text-red-600"
            icon={XCircle}
          />
        </div>
        <div className="mt-4 p-3 rounded-lg bg-gold-50 border border-gold-200 text-sm text-gold-800">
          <strong>اليوم:</strong> {stats.appointments.today} حجز
        </div>
      </section>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickAction
          to="/admin/reports"
          label="عرض التقارير"
          subtitle="إحصائيات آخر 7 أيام"
          color="bg-navy-500 hover:bg-navy-600 text-white"
        />
        <QuickAction
          to="/admin/slots"
          label="إدارة السعة"
          subtitle="تحكم في مواعيد الفروع"
          color="bg-gold-500 hover:bg-gold-600 text-navy-500"
        />
        <QuickAction
          to="/admin/logs"
          label="سجل النشاط"
          subtitle="آخر الإجراءات في النظام"
          color="bg-white border border-slate-200 hover:border-gold-400 text-navy-500"
        />
      </div>
    </div>
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

function MiniStat({ label, value, color, icon: Icon }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3 text-center">
      {Icon && <Icon className={`h-4 w-4 mx-auto mb-1 ${color}`} strokeWidth={1.75} />}
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}

function QuickAction({ to, label, subtitle, color }) {
  return (
    <Link
      to={to}
      className={`rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 shadow-gov ${color}`}
    >
      <div className="text-base font-bold leading-tight">{label}</div>
      <div className="text-xs opacity-80 mt-1">{subtitle}</div>
    </Link>
  );
}

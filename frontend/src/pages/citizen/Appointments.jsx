import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  XCircle,
  AlertCircle,
  Plus,
  QrCode,
  Filter,
  CheckCircle2,
  Hourglass,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import { useCitizenSession } from "../../lib/citizenAuth.js";
import { cancelAppointment } from "../../lib/api.js";

const FILTERS = [
  { key: "all", label: "الكل" },
  { key: "upcoming", label: "القادمة" },
  { key: "completed", label: "المنجزة" },
  { key: "cancelled", label: "الملغاة" },
];

export default function CitizenAppointments() {
  const { session, appointments, loading, error, refresh } = useCitizenSession();
  const [filter, setFilter] = useState("all");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [toast, setToast] = useState(null);

  const filtered = useMemo(() => {
    const today = startOfToday();
    const sorted = [...appointments].sort(
      (a, b) => new Date(b.slotId?.date) - new Date(a.slotId?.date)
    );
    if (filter === "upcoming") {
      return sorted.filter(
        (a) => a.status === "confirmed" && new Date(a.slotId?.date) >= today
      );
    }
    if (filter === "completed") {
      return sorted.filter((a) => a.status === "completed" || a.status === "verified");
    }
    if (filter === "cancelled") {
      return sorted.filter((a) => a.status === "cancelled");
    }
    return sorted;
  }, [appointments, filter]);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setActionError(null);
    try {
      setSubmitting(true);
      await cancelAppointment(cancelTarget._id, session.nationalId, reason.trim() || undefined);
      setCancelTarget(null);
      setReason("");
      setToast({ type: "success", message: "تم إلغاء الحجز بنجاح." });
      await refresh();
      setTimeout(() => setToast(null), 3500);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        "تعذر إلغاء الحجز. حاول مجدداً.";
      setActionError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && appointments.length === 0) {
    return <LoadingSpinner message="جاري تحميل الحجوزات..." />;
  }

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy-500">حجوزاتي</h1>
            <p className="text-slate-500 mt-1 text-sm">
              عرض كافة الحجوزات وإمكانية إلغاء الحجوزات القادمة
            </p>
          </div>
          <Link to="/" className="btn-primary inline-flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" strokeWidth={1.75} />
            حجز جديد
          </Link>
        </div>

        {error && <div className="mb-4"><ErrorMessage message={error} onRetry={() => refresh()} /></div>}

        {toast && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
            <span>{toast.message}</span>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
          <Filter className="h-4 w-4 text-slate-400 flex-shrink-0" strokeWidth={1.75} />
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                filter === f.key
                  ? "bg-navy-500 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-gold-400 hover:text-gold-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="card-standard text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-slate-300 mb-3" strokeWidth={1.5} />
            <p className="text-slate-500 text-sm">لا توجد حجوزات في هذا التصنيف</p>
            <Link to="/" className="btn-primary inline-flex items-center gap-2 mt-4">
              <Plus className="h-4 w-4" strokeWidth={1.75} />
              احجز موعدك
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((apt) => (
              <AppointmentCard
                key={apt._id}
                apt={apt}
                onCancel={() => {
                  setCancelTarget(apt);
                  setActionError(null);
                  setReason("");
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cancel modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" dir="rtl">
          <div className="bg-white rounded-2xl shadow-gov-lg w-full max-w-md p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-600" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="font-bold text-navy-500">تأكيد إلغاء الحجز</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  هذا الإجراء لا يمكن التراجع عنه.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 text-sm space-y-1 mb-4">
              <div className="font-semibold text-navy-600">{cancelTarget.serviceId?.name}</div>
              <div className="text-slate-600 text-xs flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
                {cancelTarget.branchId?.name} — {cancelTarget.branchId?.city}
              </div>
              <div className="text-slate-600 text-xs flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
                {formatDate(cancelTarget.slotId?.date)}
              </div>
              <div className="text-slate-600 text-xs flex items-center gap-1.5" dir="ltr">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
                {cancelTarget.slotId?.startTime} - {cancelTarget.slotId?.endTime}
              </div>
            </div>

            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              سبب الإلغاء (اختياري)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={300}
              rows={3}
              placeholder="مثال: تعارض في المواعيد"
              className="input-standard resize-none"
            />

            {actionError && (
              <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                {actionError}
              </div>
            )}

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => {
                  setCancelTarget(null);
                  setReason("");
                }}
                disabled={submitting}
                className="btn-secondary flex-1"
              >
                إلغاء
              </button>
              <button
                onClick={handleCancel}
                disabled={submitting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white rounded-lg font-semibold py-3 transition"
              >
                {submitting ? "جاري الإلغاء..." : "تأكيد الإلغاء"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AppointmentCard({ apt, onCancel }) {
  const today = startOfToday();
  const slotDate = apt.slotId?.date ? new Date(apt.slotId.date) : null;
  const isFuture = slotDate && slotDate >= today;
  const canCancel = apt.status === "confirmed" && isFuture;

  const statusCfg = {
    confirmed: { label: "مؤكد", cls: "bg-blue-50 text-blue-700 border-blue-200", icon: Hourglass },
    cancelled: { label: "ملغي", cls: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
    completed: { label: "منجز", cls: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle2 },
    verified: { label: "تم التحقق", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  }[apt.status] || { label: apt.status, cls: "bg-slate-50 text-slate-700 border-slate-200", icon: Hourglass };

  return (
    <div className="card-standard hover:shadow-gov-lg transition">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="font-bold text-navy-500">{apt.serviceId?.name || "—"}</div>
          <div className="text-xs text-slate-500 mt-0.5" dir="ltr">
            رقم الحجز: {apt.bookingReference}
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusCfg.cls}`}
        >
          <statusCfg.icon className="h-3 w-3" strokeWidth={2} />
          {statusCfg.label}
        </span>
      </div>

      <dl className="space-y-2 text-sm border-t border-slate-100 pt-3">
        <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.75} />
          <span>{apt.branchId?.name} — {apt.branchId?.city}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.75} />
          <span>{formatDate(apt.slotId?.date)}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600" dir="ltr">
          <Clock className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.75} />
          <span>{apt.slotId?.startTime} - {apt.slotId?.endTime}</span>
        </div>
      </dl>

      <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
        {apt.status === "confirmed" && (
          <Link
            to={`/citizen/confirmation?ref=${encodeURIComponent(apt.bookingReference)}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-gold-300 text-gold-700 hover:bg-gold-50 transition"
          >
            <QrCode className="h-4 w-4" strokeWidth={1.75} />
            عرض QR
          </Link>
        )}
        {canCancel && (
          <button
            onClick={onCancel}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-red-300 text-red-700 hover:bg-red-50 transition"
          >
            <XCircle className="h-4 w-4" strokeWidth={1.75} />
            إلغاء الحجز
          </button>
        )}
      </div>
    </div>
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
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

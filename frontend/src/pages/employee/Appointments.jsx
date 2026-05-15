import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  ClipboardList,
  RefreshCw,
  AlertCircle,
  ScanLine,
  Filter,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import { useEmployeeSession } from "../../lib/employeeAuth.js";
import { getAppointmentsByDate, updateAppointmentStatus } from "../../lib/api.js";

const STATUS_LABEL = {
  confirmed: { label: "في الانتظار", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  verified: { label: "تم التحقق", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  completed: { label: "منجز", cls: "bg-green-50 text-green-700 border-green-200" },
  cancelled: { label: "ملغي", cls: "bg-red-50 text-red-700 border-red-200" },
};

const FILTER_TABS = [
  { key: "all", label: "الكل" },
  { key: "confirmed", label: "في الانتظار" },
  { key: "verified", label: "تم التحقق" },
  { key: "completed", label: "منجز" },
  { key: "cancelled", label: "ملغي" },
];

export default function EmployeeAppointments() {
  const { session, loading: sessionLoading } = useEmployeeSession();
  const [date, setDate] = useState(() => localDayString(new Date()));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState(null);
  const [actingId, setActingId] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAppointmentsByDate(date);
      setData(result);
    } catch (err) {
      setError(err?.response?.data?.message || "تعذر تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const filtered = useMemo(() => {
    const list = data?.data || [];
    const q = search.trim();
    return list.filter((a) => {
      if (filter !== "all" && a.status !== filter) return false;
      if (q) {
        const haystack = [
          a.citizenName,
          a.nationalId,
          a.serviceId?.name,
          a.branchId?.name,
          a.slotId?.startTime,
          a.bookingReference,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [data, filter, search]);

  const handleMarkVerified = async (apt) => {
    if (!session?._id) return;
    try {
      setActingId(apt._id);
      await updateAppointmentStatus(apt._id, session._id, "verified");
      setToast({ type: "success", message: `تم تأكيد حضور ${apt.citizenName}` });
      await fetchData();
      setTimeout(() => setToast(null), 3500);
    } catch (err) {
      setToast({
        type: "error",
        message: err?.response?.data?.message || "تعذر تحديث الحالة",
      });
      setTimeout(() => setToast(null), 4000);
    } finally {
      setActingId(null);
    }
  };

  const handleExportCsv = () => {
    if (!filtered.length) return;
    const headers = ["المواطن", "الرقم القومي", "الخدمة", "الفرع", "التوقيت", "الحالة", "رقم الحجز"];
    const rows = filtered.map((a) => [
      a.citizenName,
      a.nationalId,
      a.serviceId?.name || "",
      a.branchId?.name || "",
      `${a.slotId?.startTime || ""} - ${a.slotId?.endTime || ""}`,
      STATUS_LABEL[a.status]?.label || a.status,
      a.bookingReference,
    ]);
    const csv =
      "﻿" + // BOM for Excel UTF-8
      [headers, ...rows]
        .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
        .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `appointments-${date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = data?.stats || { total: 0, pending: 0, verified: 0, completed: 0, cancelled: 0 };
  const checkedInCount = stats.verified + stats.completed;

  if (sessionLoading) {
    return <LoadingSpinner message="جاري التحميل..." />;
  }

  return (
    <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy-500 flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-gold-600" strokeWidth={1.75} />
              المراجعة اليومية
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              إدارة ومتابعة طلبات المواطنين بتاريخ{" "}
              <span dir="ltr" className="font-mono">{date}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-standard w-auto"
              dir="ltr"
            />
            <button
              onClick={fetchData}
              className="btn-secondary inline-flex items-center gap-2"
              title="تحديث"
            >
              <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
              <span className="hidden sm:inline">تحديث</span>
            </button>
            <button
              onClick={handleExportCsv}
              disabled={!filtered.length}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold transition shadow-gov"
            >
              <Download className="h-4 w-4" strokeWidth={1.75} />
              تصدير Excel
            </button>
          </div>
        </div>

        {error && <div className="mb-4"><ErrorMessage message={error} onRetry={fetchData} /></div>}

        {toast && (
          <div
            className={`mb-4 rounded-lg border px-4 py-3 text-sm flex items-start gap-2 ${
              toast.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
            ) : (
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
            )}
            <span>{toast.message}</span>
          </div>
        )}

        {/* Search */}
        <div className="card-standard mb-4">
          <div className="relative mb-4">
            <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-slate-400 pointer-events-none">
              <Search className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم، الرقم القومي، أو نوع الخدمة..."
              className="input-standard ps-9"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="h-4 w-4 text-slate-400 flex-shrink-0" strokeWidth={1.75} />
            {FILTER_TABS.map((f) => (
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
        </div>

        {/* Table */}
        <div className="card-standard p-0 overflow-hidden mb-4">
          {loading ? (
            <LoadingSpinner message="جاري تحميل الحجوزات..." />
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Calendar className="h-12 w-12 mx-auto text-slate-300 mb-3" strokeWidth={1.5} />
              <p className="text-sm">
                {search || filter !== "all"
                  ? "لا توجد نتائج تطابق البحث"
                  : "لا توجد حجوزات في هذا التاريخ"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs text-slate-600 border-b border-slate-200">
                    <th className="text-start font-semibold py-3 px-4">المواطن</th>
                    <th className="text-start font-semibold py-3 px-4 hidden md:table-cell">الرقم القومي</th>
                    <th className="text-start font-semibold py-3 px-4">نوع الخدمة</th>
                    <th className="text-start font-semibold py-3 px-4 hidden lg:table-cell">الفرع</th>
                    <th className="text-start font-semibold py-3 px-4">التوقيت</th>
                    <th className="text-start font-semibold py-3 px-4">الحالة</th>
                    <th className="text-start font-semibold py-3 px-4">الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((apt) => (
                    <tr key={apt._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-navy-600">{apt.citizenName}</div>
                        <div className="text-[11px] text-slate-400 md:hidden" dir="ltr">{apt.nationalId}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 hidden md:table-cell" dir="ltr">
                        {apt.nationalId}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{apt.serviceId?.name || "—"}</td>
                      <td className="py-3 px-4 text-slate-600 hidden lg:table-cell">
                        {apt.branchId?.name || "—"}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="inline-flex items-center gap-1.5" dir="ltr">
                          <Clock className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.75} />
                          {apt.slotId?.startTime}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={apt.status} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setDetail(apt)}
                            className="p-2 rounded-lg border border-slate-200 hover:border-navy-400 hover:bg-navy-50 text-slate-600 hover:text-navy-500 transition"
                            title="عرض التفاصيل"
                          >
                            <Eye className="h-4 w-4" strokeWidth={1.75} />
                          </button>
                          {apt.status === "confirmed" && (
                            <button
                              onClick={() => handleMarkVerified(apt)}
                              disabled={actingId === apt._id}
                              className="p-2 rounded-lg border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 text-emerald-600 transition disabled:opacity-50"
                              title="تأكيد الحضور"
                            >
                              {actingId === apt._id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                              ) : (
                                <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card-standard flex items-center justify-between">
            <span className="text-sm text-slate-500">إجمالي معاملات اليوم</span>
            <span className="text-3xl font-bold text-navy-500">{stats.total}</span>
          </div>
          <div className="card-standard flex items-center justify-between">
            <span className="text-sm text-slate-500">تم إنجازها (Checked-in)</span>
            <span className="text-3xl font-bold text-green-600">{checkedInCount}</span>
          </div>
        </div>

        {/* Quick scan CTA */}
        <div className="text-center mt-6">
          <Link
            to="/employee/scan"
            className="inline-flex items-center gap-2 text-sm text-gold-600 hover:text-gold-700 font-semibold"
          >
            <ScanLine className="h-4 w-4" strokeWidth={1.75} />
            للمسح السريع لرمز QR
          </Link>
        </div>

      {/* Detail modal */}
      {detail && <DetailModal apt={detail} onClose={() => setDetail(null)} />}
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

function DetailModal({ apt, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" dir="rtl">
      <div className="bg-white rounded-2xl shadow-gov-lg w-full max-w-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-navy-500">تفاصيل الحجز</h3>
            <p className="text-xs text-slate-500 mt-0.5" dir="ltr">{apt.bookingReference}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <XCircle className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <dl className="space-y-2 text-sm">
          <Row label="الاسم" value={apt.citizenName} />
          <Row label="الرقم القومي" value={apt.nationalId} dir="ltr" />
          <Row label="البريد" value={apt.citizenEmail} dir="ltr" />
          <Row label="الهاتف" value={apt.citizenPhone} dir="ltr" />
          <Row label="الخدمة" value={apt.serviceId?.name} />
          <Row label="الفرع" value={apt.branchId?.name} />
          <Row label="المدينة" value={apt.branchId?.city} />
          <Row label="التاريخ" value={formatDate(apt.slotId?.date)} />
          <Row label="التوقيت" value={`${apt.slotId?.startTime} - ${apt.slotId?.endTime}`} dir="ltr" />
          <Row label="الحالة" value={STATUS_LABEL[apt.status]?.label || apt.status} />
          {apt.verifiedAt && (
            <Row label="تم التحقق في" value={new Date(apt.verifiedAt).toLocaleString("ar-EG")} />
          )}
          {apt.cancelledAt && (
            <>
              <Row label="ألغي في" value={new Date(apt.cancelledAt).toLocaleString("ar-EG")} />
              {apt.cancellationReason && <Row label="سبب الإلغاء" value={apt.cancellationReason} />}
            </>
          )}
        </dl>

        <button
          onClick={onClose}
          className="btn-primary w-full mt-5"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, dir }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5 border-b border-slate-100 last:border-0">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="font-medium text-navy-600 text-sm text-end break-all" dir={dir}>{value || "—"}</dd>
    </div>
  );
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

function localDayString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

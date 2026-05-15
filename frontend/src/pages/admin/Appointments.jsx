import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Filter, RefreshCw, Search } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import { getAdminAppointments } from "../../lib/api.js";

const STATUS_LABEL = {
  confirmed: { label: "في الانتظار", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  verified: { label: "تم التحقق", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  completed: { label: "منجز", cls: "bg-green-50 text-green-700 border-green-200" },
  cancelled: { label: "ملغي", cls: "bg-red-50 text-red-700 border-red-200" },
};

const FILTERS = [
  { key: "", label: "الكل" },
  { key: "confirmed", label: "في الانتظار" },
  { key: "verified", label: "تم التحقق" },
  { key: "completed", label: "منجز" },
  { key: "cancelled", label: "ملغي" },
];

export default function AdminAppointments() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAdminAppointments({ status: status || undefined, limit: 200 });
      setList(result.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "تعذر تحميل الحجوزات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((a) =>
      [a.citizenName, a.nationalId, a.serviceId?.name, a.branchId?.name, a.bookingReference]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [list, search]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-500 flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-gold-600" strokeWidth={1.75} />
            كل الحجوزات
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            عرض شامل لجميع الحجوزات في النظام بدون قيود
          </p>
        </div>
        <button onClick={load} className="btn-secondary inline-flex items-center gap-2 self-start">
          <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
          تحديث
        </button>
      </div>

      <div className="card-standard mb-4">
        <div className="relative mb-4">
          <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-slate-400 pointer-events-none">
            <Search className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم، الرقم القومي، الخدمة، الفرع، رقم الحجز..."
            className="input-standard ps-9"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="h-4 w-4 text-slate-400 flex-shrink-0" strokeWidth={1.75} />
          {FILTERS.map((f) => (
            <button
              key={f.key || "all"}
              onClick={() => setStatus(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                status === f.key
                  ? "bg-navy-500 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-gold-400 hover:text-gold-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="جاري تحميل البيانات..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={load} />
      ) : filtered.length === 0 ? (
        <div className="card-standard text-center py-12 text-slate-500">
          لا توجد حجوزات مطابقة
        </div>
      ) : (
        <div className="card-standard p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-600 border-b border-slate-200">
                  <th className="text-start py-3 px-4">المواطن</th>
                  <th className="text-start py-3 px-4 hidden md:table-cell">الرقم القومي</th>
                  <th className="text-start py-3 px-4">الخدمة</th>
                  <th className="text-start py-3 px-4 hidden lg:table-cell">الفرع</th>
                  <th className="text-start py-3 px-4">التاريخ</th>
                  <th className="text-start py-3 px-4">الوقت</th>
                  <th className="text-start py-3 px-4">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-medium text-navy-600">{a.citizenName}</td>
                    <td className="py-3 px-4 text-slate-600 hidden md:table-cell" dir="ltr">
                      {a.nationalId}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{a.serviceId?.name || "—"}</td>
                    <td className="py-3 px-4 text-slate-600 hidden lg:table-cell">
                      {a.branchId?.name || "—"}
                    </td>
                    <td className="py-3 px-4 text-slate-600" dir="ltr">
                      {formatShortDate(a.slotId?.date)}
                    </td>
                    <td className="py-3 px-4 text-slate-600" dir="ltr">
                      {a.slotId?.startTime}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={a.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
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
    return new Date(d).toLocaleDateString("ar-EG", { day: "numeric", month: "short" });
  } catch {
    return "—";
  }
}

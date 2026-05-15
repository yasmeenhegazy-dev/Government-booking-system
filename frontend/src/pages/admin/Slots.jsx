import { useEffect, useMemo, useState } from "react";
import { Calendar, RefreshCw, Save, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import { getAdminSlots, updateAdminSlot } from "../../lib/api.js";

export default function AdminSlots() {
  const [date, setDate] = useState(() => localDayString(new Date()));
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [edits, setEdits] = useState({}); // { slotId: { capacity?, isActive? } }
  const [savingId, setSavingId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      setEdits({});
      const data = await getAdminSlots(date);
      setPayload(data);
    } catch (err) {
      setError(err?.response?.data?.message || "تعذر تحميل المواعيد");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const s of payload?.data || []) {
      const key = `${s.branch?.name || "—"} | ${s.branch?.city || "—"}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(s);
    }
    return Array.from(map.entries());
  }, [payload]);

  const onChange = (id, key, value) => {
    setEdits((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [key]: value },
    }));
  };

  const save = async (slot) => {
    const change = edits[slot._id];
    if (!change) return;
    try {
      setSavingId(slot._id);
      await updateAdminSlot(slot._id, change);
      toast.success("تم حفظ التعديل");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "تعذر حفظ التعديل");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-500 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-gold-600" strokeWidth={1.75} />
            إدارة المواعيد والسعة
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            تحكم في عدد الأماكن المتاحة وحالة كل موعد
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-standard w-auto"
            dir="ltr"
          />
          <button onClick={load} className="btn-secondary inline-flex items-center gap-2">
            <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
            تحديث
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="جاري التحميل..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={load} />
      ) : grouped.length === 0 ? (
        <div className="card-standard text-center py-12 text-slate-500">
          <Calendar className="h-10 w-10 mx-auto mb-2 text-slate-300" strokeWidth={1.5} />
          لا توجد مواعيد في هذا التاريخ
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([branchKey, slots]) => (
            <section key={branchKey} className="card-standard p-0 overflow-hidden">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 font-semibold text-navy-500">
                {branchKey}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-slate-500 border-b border-slate-200">
                      <th className="text-start font-medium py-3 px-4">التوقيت</th>
                      <th className="text-start font-medium py-3 px-4">المحجوز</th>
                      <th className="text-start font-medium py-3 px-4">السعة</th>
                      <th className="text-start font-medium py-3 px-4">الحالة</th>
                      <th className="text-start font-medium py-3 px-4">حفظ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map((s) => {
                      const edit = edits[s._id] || {};
                      const dirty = "capacity" in edit || "isActive" in edit;
                      const capValue = edit.capacity ?? s.capacity;
                      const activeValue = edit.isActive ?? s.isActive;
                      return (
                        <tr key={s._id} className="border-b border-slate-100 last:border-0">
                          <td className="py-3 px-4 font-medium" dir="ltr">
                            {s.startTime} - {s.endTime}
                          </td>
                          <td className="py-3 px-4 text-slate-600">{s.bookedCount}</td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              min={0}
                              max={50}
                              value={capValue}
                              onChange={(e) =>
                                onChange(s._id, "capacity", parseInt(e.target.value, 10) || 0)
                              }
                              className="input-standard w-20"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => onChange(s._id, "isActive", !activeValue)}
                              className="inline-flex items-center gap-1.5 text-sm"
                              title="تبديل الحالة"
                            >
                              {activeValue ? (
                                <>
                                  <ToggleRight className="h-5 w-5 text-emerald-500" strokeWidth={1.75} />
                                  <span className="text-emerald-600 font-medium">مفعّل</span>
                                </>
                              ) : (
                                <>
                                  <ToggleLeft className="h-5 w-5 text-slate-400" strokeWidth={1.75} />
                                  <span className="text-slate-500">معطّل</span>
                                </>
                              )}
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              disabled={!dirty || savingId === s._id}
                              onClick={() => save(s)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-navy-500 hover:bg-navy-600 text-white disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition"
                            >
                              <Save className="h-4 w-4" strokeWidth={1.75} />
                              {savingId === s._id ? "..." : "حفظ"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function localDayString(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

import { useEffect, useState } from "react";
import { ScrollText, RefreshCw } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import { getAdminLogs } from "../../lib/api.js";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminLogs();
      setLogs(data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "تعذر تحميل السجل");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-500 flex items-center gap-2">
            <ScrollText className="h-6 w-6 text-gold-600" strokeWidth={1.75} />
            سجل النشاط
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            آخر الإجراءات على النظام (تتحدث تلقائياً كل 10 ثوان)
          </p>
        </div>
        <button onClick={load} className="btn-secondary inline-flex items-center gap-2">
          <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
          تحديث
        </button>
      </div>

      {loading && logs.length === 0 ? (
        <LoadingSpinner message="جاري تحميل السجل..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={load} />
      ) : logs.length === 0 ? (
        <div className="card-standard text-center py-12 text-slate-500">
          <ScrollText className="h-10 w-10 mx-auto mb-2 text-slate-300" strokeWidth={1.5} />
          لا توجد إجراءات مسجلة بعد
        </div>
      ) : (
        <div className="card-standard p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-600 border-b border-slate-200">
                  <th className="text-start py-3 px-4">الإجراء</th>
                  <th className="text-start py-3 px-4">التفاصيل</th>
                  <th className="text-start py-3 px-4">التوقيت</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-navy-600" dir="ltr">
                      {l.action}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-xs">
                      <code dir="ltr" className="bg-slate-50 px-2 py-0.5 rounded text-[11px]">
                        {JSON.stringify(l.meta)}
                      </code>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs whitespace-nowrap" dir="ltr">
                      {formatTime(l.at)}
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

function formatTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("ar-EG", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return iso;
  }
}

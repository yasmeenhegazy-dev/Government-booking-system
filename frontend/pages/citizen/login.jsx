import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Building2, IdCard, ArrowLeft, AlertCircle } from "lucide-react";
import { getUserAppointments } from "../../lib/api";
import { saveCitizenSession, getCitizenSession } from "../../lib/citizenAuth";

const NID_RE = /^\d{14}$/;

export default function CitizenLogin() {
  const router = useRouter();
  const [nationalId, setNationalId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // If already logged in, bounce to dashboard
  useEffect(() => {
    const s = getCitizenSession();
    if (s?.nationalId) router.replace("/citizen/dashboard");
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const trimmed = nationalId.trim();
    if (!NID_RE.test(trimmed)) {
      setError("الرقم القومي يجب أن يكون 14 رقماً.");
      return;
    }
    try {
      setSubmitting(true);
      const list = await getUserAppointments(trimmed);
      if (!list || list.length === 0) {
        setError("لا يوجد حجوزات مسجلة بهذا الرقم القومي. احجز موعداً أولاً.");
        return;
      }
      const latest = list[0];
      saveCitizenSession({
        nationalId: trimmed,
        citizenName: latest.citizenName,
        citizenEmail: latest.citizenEmail,
        citizenPhone: latest.citizenPhone,
      });
      router.replace("/citizen/dashboard");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        "تعذر تسجيل الدخول. حاول مجدداً.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-500 via-navy-600 to-navy-700 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gold-500 items-center justify-center shadow-gov-lg mb-4">
            <Building2 className="h-8 w-8 text-navy-500" strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-bold text-white">بوابة الخدمات الرقمية</h1>
          <p className="text-gold-200 text-sm mt-1">حساب المواطن — تسجيل الدخول</p>
        </div>

        <div className="bg-white rounded-2xl shadow-gov-lg p-6 sm:p-8">
          <h2 className="text-lg font-bold text-navy-500 mb-1">أدخل الرقم القومي</h2>
          <p className="text-sm text-slate-500 mb-6">
            للوصول إلى لوحة حجوزاتك، استخدم نفس الرقم القومي الذي حجزت به.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="nid" className="block text-sm font-medium text-slate-700 mb-1.5">
              الرقم القومي
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-slate-400 pointer-events-none">
                <IdCard className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <input
                id="nid"
                type="text"
                inputMode="numeric"
                maxLength={14}
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ""))}
                placeholder="14 رقم"
                dir="ltr"
                className={`input-standard ps-9 ${error ? "border-red-400" : ""}`}
                autoComplete="off"
              />
            </div>

            {error && (
              <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full mt-5 inline-flex items-center justify-center gap-2"
            >
              {submitting ? "جاري التحقق..." : "دخول"}
              {!submitting && <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
            ليس لديك حجز بعد؟{" "}
            <Link href="/" className="text-gold-600 font-semibold hover:text-gold-700">
              احجز موعدك الآن
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-white/60 mt-6">
          © {new Date().getFullYear()} بوابة الحجز الحكومية
        </p>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Building2, KeyRound, ArrowLeft, AlertCircle } from "lucide-react";
import { employeeLogin } from "../../lib/api";
import { saveEmployeeSession, getEmployeeSession } from "../../lib/employeeAuth";

export default function EmployeeLoginPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const s = getEmployeeSession();
    if (s?._id) router.replace("/employee/dashboard");
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const trimmed = code.trim();
    if (trimmed.length < 3) {
      setError("أدخل كود موظف صحيح (3 خانات على الأقل).");
      return;
    }
    try {
      setSubmitting(true);
      const employee = await employeeLogin(trimmed);
      saveEmployeeSession(employee);
      router.replace("/employee/dashboard");
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
          <p className="text-gold-200 text-sm mt-1">حساب الموظف — تسجيل الدخول</p>
        </div>

        <div className="bg-white rounded-2xl shadow-gov-lg p-6 sm:p-8">
          <h2 className="text-lg font-bold text-navy-500 mb-1">كود الموظف</h2>
          <p className="text-sm text-slate-500 mb-6">
            أدخل كود الموظف الخاص بك للوصول إلى لوحة التحكم.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-1.5">
              كود الموظف
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-slate-400 pointer-events-none">
                <KeyRound className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="EMP-001"
                dir="ltr"
                className={`input-standard ps-9 ${error ? "border-red-400" : ""}`}
                autoComplete="off"
                maxLength={30}
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

          <div className="mt-6 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 space-y-1">
            <p>للتجربة استخدم: <span className="font-mono font-semibold text-navy-500">EMP-001</span> أو <span className="font-mono font-semibold text-navy-500">EMP-002</span></p>
            <p>
              مواطن؟{" "}
              <Link href="/citizen/login" className="text-gold-600 font-semibold hover:text-gold-700">
                دخول حساب المواطن
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-white/60 mt-6">
          © {new Date().getFullYear()} بوابة الحجز الحكومية
        </p>
      </div>
    </div>
  );
}

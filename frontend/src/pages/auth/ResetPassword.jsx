import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPasswordRequest } from "../../lib/api.js";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ otp: "", email: "", newPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await resetPasswordRequest(form);
      toast.success(data.message);
      setTimeout(() => navigate("/auth/login", { replace: true }), 1000);
    } catch (err) {
      const msg = err?.response?.data?.message || "حصل خطأ، حاول مره اخري ";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-5 rtl">
      <div className="bg-white p-10 rounded-3xl shadow-lg border w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="bg-slate-100 w-[70px] h-[70px] rounded-xl flex items-center justify-center mx-auto mb-4">
            <img src="/logo.svg" alt="Logo" className="w-11" />
          </div>

          <h2 className="text-[#002B5B] font-extrabold text-2xl">
            تعيين كلمة مرور جديدة
          </h2>

          <p className="text-slate-500 text-sm mt-1">
            أدخل رمز التحقق وكلمة المرور الجديدة
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-[#C5A059]/10 border-r-4 border-[#C5A059] p-4 rounded-lg mb-6 text-sm text-[#002B5B] leading-relaxed text-right">
          <strong className="block mb-1">معلومة</strong>
          أدخل رمز التحقق (OTP) الذي تم إرساله إليك ثم قم بتعيين كلمة مرور جديدة.
        </div>

        <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
          {/* OTP */}
          <div className="text-right">
            <label className="block text-[#002B5B] font-bold text-sm mb-1">
              رمز التحقق (OTP)
            </label>
            <input
              type="text"
              placeholder="أدخل الرمز"
              className="w-full p-3 rounded-xl border bg-slate-50 outline-none"
              required
              value={form.otp}
              onChange={(e) => setForm({ ...form, otp: e.target.value })}
            />
          </div>

          {/* Email */}
          <div className="text-right">
            <label className="block text-[#002B5B] font-bold text-sm mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              placeholder="example@email.com"
              className="w-full p-3 rounded-xl border bg-slate-50 outline-none"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Password */}
          <div className="text-right">
            <label className="block text-[#002B5B] font-bold text-sm mb-1">
              كلمة المرور الجديدة
            </label>
            <input
              type="password"
              placeholder="********"
              className="w-full p-3 rounded-xl border bg-slate-50 outline-none"
              required
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-lg shadow-md transition
              ${
                loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-[#002B5B] text-white hover:opacity-90"
              }
            `}
          >
            {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
          </button>

          {/* Link */}
          <div className="text-center text-sm text-slate-500">
            العودة لصفحة{" "}
            <Link to="/auth/login" className="text-[#002B5B] font-extrabold">
              تسجيل الدخول
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

import { Link } from "react-router";

export default function ForgetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">استعادة كلمة المرور</h2>
          <p className="text-gray-500 text-sm">
            ادخل بياناتك لإعادة تعيين كلمة المرور
          </p>
        </div>

        {/* Info Text */}
        <div className="bg-gray-200 p-3 rounded-lg text-sm text-gray-600 leading-relaxed">
          كيف يعمل الاسترداد؟<br />
          قم بإدخال الرقم القومي ورقم الهاتف الخاص بك، وسيتم إرسال رمز تحقق (OTP) إليك لإعادة تعيين كلمة المرور.
        </div>

        {/* National ID */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-black">
            الرقم القومي
          </label>
          <input
            type="number"
            placeholder="ادخل الرقم القومي (14 رقم)"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-black">
            رقم الهاتف
          </label>
          <input
            type="tel"
            placeholder="01xxxxxxxxx"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Submit */}
        <button className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition">
          إرسال رمز التحقق
        </button>

        {/* Back to login */}
        <div className="text-center text-sm">
          <Link to="/" className="text-black hover:underline">
            العودة لتسجيل الدخول
          </Link>
        </div>

      </form>
    </div>
  );
}
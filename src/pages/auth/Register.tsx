import { useState } from "react";
import { Link } from "react-router";

export default function Register() {
  const [citizen, setCitizen] = useState(true);
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">مرحبا بك</h2>
          <p className="text-gray-500 text-sm">سجل دخولك للمتابعة</p>
        </div>

        {/* Switch buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setCitizen(true);
            }}
            type="button"
            className={`flex-1 py-2 rounded-lg ${
              citizen ? "bg-black text-white" : "bg-gray-200 text-gray-700"
            } font-medium cursor-pointer`}
          >
            مواطن
          </button>
          <button
            type="button"
            className={`flex-1 py-2 rounded-lg ${citizen  ? " bg-gray-200 " :  " bg-black text-white " }  text-gray-700 cursor-pointer`}
            onClick={() => {
              setCitizen(false);
            }}
          >
            موظف
          </button>
        </div>

        {/* First & Last Name */}
        <div className="flex gap-3">
          <div className="w-1/2 space-y-1">
            <label className="text-sm font-medium text-black">
              الاسم الأول
            </label>
            <input
              type="text"
              placeholder="أحمد"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="w-1/2 space-y-1">
            <label className="text-sm font-medium text-black">
              الاسم الأخير
            </label>
            <input
              type="text"
              placeholder="محمد"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-black">
            البريد الالكتروني
          </label>
          <input
            type="email"
            placeholder="example@email.com"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* National ID */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-black">الرقم القومي</label>
          <input
            type="number"
            placeholder="ادخل الرقم القومي (14 رقم)"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-black">كلمة المرور</label>
          <input
            type="password"
            placeholder="********"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Forget password */}
        {/* <div className="text-right">
          <a href="#" className="text-sm text-blue-500 hover:underline">
            نسيت كلمة المرور؟
          </a>
        </div> */}

        {/* Submit */}
        <button className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition">
          انشاء حساب
        </button>

        {/* Register */}
        <div className="text-center text-sm">
          <span>لديك حساب بالفعل؟ </span>
          <Link to="/" className="text-blue-500 hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </form>
    </div>
  );
}

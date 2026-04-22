import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [citizen, setCitizen] = useState(Boolean);

  const [form, setForm] = useState({
    fName: "",
    lName: "",
    email: "",
    pass: "",
    nationalId: "",
    role: "",
  });
  async function register(e) {
    e.preventDefault();
    if (!form.role) {
      alert("اختار مواطن أو موظف");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={register}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">مرحبا بك</h2>
          <p className="text-gray-500 text-sm">سجل دخولك للمتابعة</p>
        </div>

        {/* Switch buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setForm({ ...form, role: "citizen" });
              setCitizen(true);
            }}
            type="button"
            className={`flex-1 py-2 rounded-lg ${
              citizen == true
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700"
            } font-medium cursor-pointer`}
          >
            مواطن
          </button>
          <button
            onClick={() => {
              setForm({ ...form, role: "employee" });
              setCitizen(false);
            }}
            type="button"
            className={`flex-1 py-2 rounded-lg ${citizen == true ? " bg-gray-200 " : " bg-black text-white "}  text-gray-700 cursor-pointer`}
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
              name="fName"
              onChange={handleChange}
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
              name="lName"
              onChange={handleChange}
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
            name="email"
            onChange={handleChange}
            type="email"
            placeholder="example@email.com"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* National ID */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-black">الرقم القومي</label>
          <input
            name="nationalId"
            onChange={handleChange}
            type="number"
            placeholder="ادخل الرقم القومي (14 رقم)"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-black">كلمة المرور</label>
          <input
            name="pass"
            onChange={handleChange}
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
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
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
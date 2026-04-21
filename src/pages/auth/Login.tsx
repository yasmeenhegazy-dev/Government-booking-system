
import { useState } from "react";
import { Link } from "react-router";

export default function Login() {
  const [email, setEmail] = useState(true);
const [form , setForm]= useState({
  email:"",
  pass:"",
  nationalId:"",
  fName:"",
  lName:"",
  role:""
})

  function handleChange(){
    console.log("Sdada")
  }

  function login(){

  }

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={login} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
          <div className="text-center space-y-2 ">
            <h2 className="text-2xl font-bold">مرحبا بك</h2>
            <p className="text-gray-500 text-sm">سجل دخولك للمتابعة</p>
          </div>

          {/* Switch buttons */}
          <div className="flex gap-2">
            <button
            
              onClick={() => {
                setEmail(true);
              }}
              type="button"
              className={`flex-1 py-2 rounded-lg  ${email ? "bg-black text-white" :"bg-gray-200"}  font-medium text-gray-700 cursor-pointer`}
            >
              البريد الالكتروني
              
            </button>
            <button
             onClick={() => {
                setEmail(false);
              }}
              type="button"
              className={`flex-1 py-2 rounded-lg ${email ? "bg-gray-200" : "bg-black text-white"}  text-gray-700 cursor-pointer`}
            >
              رقم الهوية
            </button>
          </div>
          {email ? (
            <div className="space-y-1">
              <label className="text-sm font-medium text-black">
                البريد الالكتروني
              </label>
              <input
              onChange={handleChange}
              value={form.email}
                type="email"
                name="email"
                placeholder="example@email.com"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-sm font-medium text-black">
                الرقم القومي / رقم الهويه{" "}
              </label>
              <input
               value={form.nationalId}
              onChange={handleChange}
                type="number"
                name="nationalId"
                placeholder="ادخل الرقم القومي المكون من 14 رقما"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium  text-black">
              كلمة المرور
            </label>
            <input
            onChange={handleChange}
             value={form.pass}
              type="password"
              name="pass"
              placeholder="********"
              className="w-full px-3 py-2 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Forget password */}
          <div className="text-right">
            <Link
              to="/forget-password"
              className="text-sm text-blue-500 hover:underline"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>

          {/* Submit */}
          <button  type="submit" className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition">
            تسجيل الدخول
          </button>

          {/* Register */}
          <div className="text-center text-sm">
            <span>ليس لديك حساب؟ </span>
            <Link to={"/register"} className="text-blue-500 hover:underline">
              إنشاء حساب جديد
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

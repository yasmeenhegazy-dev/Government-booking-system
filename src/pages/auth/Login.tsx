import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";

export default function Login() {
  const navigate = useNavigate();
  const [isEmailMode, setIsEmailMode] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "", 
    nationalId: "",
    role: "citizen"
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    
   
    const loginData = isEmailMode 
      ? { email: form.email, password: form.password, role: "citizen" }
      : { nationalId: form.nationalId, password: form.password, role: "employee" };

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userRole", data.role);

        console.log("تم تسجيل الدخول بنجاح كـ:", data.role);

        if (data.role === "employee" || !isEmailMode) {
          navigate("/dashboard");
        } else {
          navigate("/"); 
        }
      } else {
        alert(data.message || "خطأ في البريد الإلكتروني أو كلمة المرور");
      }
    } catch (err) {
      console.error("خطأ في الاتصال:", err);
      alert("السيرفر غير متصل، تأكد من تشغيل الباك-إند");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid #E2E8F0',
    background: '#F8FAFC', outline: 'none', boxSizing: 'border-box'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', color: '#002B5B', fontWeight: '700', marginBottom: '8px', fontSize: '0.9rem'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', direction: 'rtl' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0, 43, 91, 0.05)', border: '1px solid #F1F5F9', width: '100%', maxWidth: '420px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ background: '#F1F5F9', width: '80px', height: '80px', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', border: '1px solid #E2E8F0' }}>
            <img src={logo} alt="Logo" style={{ width: '55px' }} />
          </div>
          <h2 style={{ color: '#002B5B', fontWeight: '800', fontSize: '1.8rem', margin: '0' }}>مرحبا بك</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '5px' }}>سجل دخولك للمتابعة</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', background: '#F1F5F9', padding: '5px', borderRadius: '12px' }}>
            <button
              onClick={() => { setIsEmailMode(true); setForm(prev => ({...prev, role: "citizen"})); }}
              type="button"
              style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', transition: '0.3s', background: isEmailMode ? 'white' : 'transparent', color: isEmailMode ? '#002B5B' : '#64748B', boxShadow: isEmailMode ? '0 4px 10px rgba(0,0,0,0.05)' : 'none' }}
            >
              البريد الالكتروني
            </button>
            <button
              onClick={() => { setIsEmailMode(false); setForm(prev => ({...prev, role: "employee"})); }}
              type="button"
              style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', transition: '0.3s', background: !isEmailMode ? 'white' : 'transparent', color: !isEmailMode ? '#002B5B' : '#64748B', boxShadow: !isEmailMode ? '0 4px 10px rgba(0,0,0,0.05)' : 'none' }}
            >
              رقم الهوية
            </button>
          </div>

          {isEmailMode ? (
            <div style={{ textAlign: 'right' }}>
              <label style={labelStyle}>البريد الالكتروني</label>
              <input onChange={handleChange} value={form.email} type="email" name="email" placeholder="example@email.com" style={inputStyle} required />
            </div>
          ) : (
            <div style={{ textAlign: 'right' }}>
              <label style={labelStyle}>الرقم القومي / رقم الهوية</label>
              <input onChange={handleChange} value={form.nationalId} type="number" name="nationalId" placeholder="ادخل الرقم القومي" style={inputStyle} required />
            </div>
          )}

          <div style={{ textAlign: 'right' }}>
            <label style={labelStyle}>كلمة المرور</label>
            <input onChange={handleChange} value={form.password} type="password" name="password" placeholder="********" style={inputStyle} required />
          </div>

          <div style={{ textAlign: 'left' }}>
            <Link to="/forget-password" style={{ color: '#C5A059', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}>
              نسيت كلمة المرور؟
            </Link>
          </div>

          <button type="submit" style={{ width: '100%', padding: '14px', background: '#002B5B', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer', transition: '0.3s', boxShadow: '0 4px 15px rgba(0, 43, 91, 0.2)' }}>
            تسجيل الدخول
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#64748B' }}>
            <span>ليس لديك حساب؟ </span>
            <Link to="/register" style={{ color: '#002B5B', fontWeight: '700', textDecoration: 'none', marginRight: '5px' }}>
              إنشاء حساب جديد
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";

export default function Register() {
  const navigate = useNavigate();
  const [citizen, setCitizen] = useState(true);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    nationalId: "",
    role: "citizen",
  });

  async function register(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token) {
          localStorage.setItem("userToken", data.token);
        }

        console.log("تم التسجيل بنجاح:", data.message);
        
        if (form.role === "employee") {
          navigate("/dashboard");
        } else {
          navigate("/home"); 
        }
      } else {
        alert(data.message || "فشل التسجيل، تأكد من البيانات");
      }
    } catch (err) {
      console.error("خطأ في الاتصال بالسيرفر:", err);
      alert("تعذر الاتصال بالخادم، جرب مرة أخرى لاحقاً");
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid #E2E8F0',
    background: '#F8FAFC', outline: 'none', boxSizing: 'border-box', transition: '0.3s'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', color: '#002B5B', fontWeight: '700', marginBottom: '5px', fontSize: '0.85rem'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', direction: 'rtl', padding: '20px' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0, 43, 91, 0.05)', border: '1px solid #F1F5F9', width: '100%', maxWidth: '480px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ background: '#F1F5F9', width: '70px', height: '70px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
            <img src={logo} alt="Logo" style={{ width: '45px' }} />
          </div>
          <h2 style={{ color: '#002B5B', fontWeight: '800', fontSize: '1.7rem', margin: '0' }}>إنشاء حساب</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '5px' }}>سجلي بياناتك للانضمام للمنظومة</p>
        </div>

        <form onSubmit={register} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', background: '#F1F5F9', padding: '5px', borderRadius: '12px' }}>
            <button
              onClick={() => { setForm({ ...form, role: "citizen" }); setCitizen(true); }}
              type="button"
              style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: citizen ? 'white' : 'transparent', color: citizen ? '#002B5B' : '#64748B', fontWeight: '600', boxShadow: citizen ? '0 4px 10px rgba(0,0,0,0.05)' : 'none' }}
            >
              مواطن
            </button>
            <button
              onClick={() => { setForm({ ...form, role: "employee" }); setCitizen(false); }}
              type="button"
              style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: !citizen ? 'white' : 'transparent', color: !citizen ? '#002B5B' : '#64748B', fontWeight: '600', boxShadow: !citizen ? '0 4px 10px rgba(0,0,0,0.05)' : 'none' }}
            >
              موظف
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ textAlign: 'right' }}>
              <label style={labelStyle}>الاسم الأول</label>
              <input name="firstName" onChange={handleChange} value={form.firstName} type="text" style={inputStyle} required />
            </div>
            <div style={{ textAlign: 'right' }}>
              <label style={labelStyle}>الاسم الأخير</label>
              <input name="lastName" onChange={handleChange} value={form.lastName} type="text" style={inputStyle} required />
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <label style={labelStyle}>البريد الالكتروني</label>
            <input name="email" onChange={handleChange} value={form.email} type="email" placeholder="example@email.com" style={inputStyle} required />
          </div>

          <div style={{ textAlign: 'right' }}>
            <label style={labelStyle}>الرقم القومي</label>
            <input name="nationalId" onChange={handleChange} value={form.nationalId} type="number" placeholder="14 رقم" style={inputStyle} required />
          </div>

          <div style={{ textAlign: 'right' }}>
            <label style={labelStyle}>كلمة المرور</label>
            <input name="password" onChange={handleChange} value={form.password} type="password" placeholder="********" style={inputStyle} required />
          </div>

          <button type="submit" style={{ width: '100%', padding: '14px', background: '#002B5B', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer', transition: '0.3s', marginTop: '10px', boxShadow: '0 4px 15px rgba(0, 43, 91, 0.2)' }}>
            إنشاء حساب
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#64748B' }}>
            لديك حساب بالفعل؟ 
            <Link to="/" style={{ color: '#C5A059', fontWeight: '700', marginRight: '5px', textDecoration: 'none' }}>
              تسجيل الدخول
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
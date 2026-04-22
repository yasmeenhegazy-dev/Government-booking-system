import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";

export default function ForgetPassword() {
  const [form, setForm] = useState({ nationalId: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid #E2E8F0',
    background: '#F8FAFC', outline: 'none', boxSizing: 'border-box', transition: '0.3s'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', color: '#002B5B', fontWeight: '700', marginBottom: '5px', fontSize: '0.9rem'
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("تم إرسال رمز التحقق لهاتفك بنجاح");
      } else {
        alert(data.message || "البيانات غير صحيحة");
      }
    } catch (err) {
      alert("خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', direction: 'rtl', padding: '20px' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0, 43, 91, 0.05)', border: '1px solid #F1F5F9', width: '100%', maxWidth: '420px' }}>

        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <div style={{ background: '#F1F5F9', width: '70px', height: '70px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
            <img src={logo} alt="Logo" style={{ width: '45px' }} />
          </div>
          <h2 style={{ color: '#002B5B', fontWeight: '800', fontSize: '1.7rem', margin: '0' }}>استعادة الحساب</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '5px' }}>أدخل بياناتك لإعادة تعيين كلمة المرور</p>
        </div>

        <div style={{ background: 'rgba(197, 160, 89, 0.1)', borderRight: '4px solid #C5A059', padding: '15px', borderRadius: '10px', marginBottom: '25px', fontSize: '0.85rem', color: '#002B5B', lineHeight: '1.6', textAlign: 'right' }}>
          <strong style={{ display: 'block', marginBottom: '5px' }}>كيف يعمل الاسترداد؟</strong>
          سيتم إرسال رمز تحقق (OTP) لهاتفك المسجل بعد التأكد من الرقم القومي.
        </div>

        <form onSubmit={handleResetRequest} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ textAlign: 'right' }}>
            <label style={labelStyle}>الرقم القومي</label>
            <input
              type="number"
              placeholder="14 رقم"
              style={inputStyle}
              required
              value={form.nationalId}
              onChange={(e) => setForm({...form, nationalId: e.target.value})}
            />
          </div>

          <div style={{ textAlign: 'right' }}>
            <label style={labelStyle}>رقم الهاتف</label>
            <input
              type="tel"
              placeholder="01xxxxxxxxx"
              style={inputStyle}
              required
              value={form.phone}
              onChange={(e) => setForm({...form, phone: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', padding: '14px', background: loading ? '#64748B' : '#002B5B', color: 'white', 
              border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '1.1rem', 
              cursor: loading ? 'not-allowed' : 'pointer', transition: '0.3s', marginTop: '10px',
              boxShadow: '0 4px 15px rgba(0, 43, 91, 0.2)'
            }}
          >
            {loading ? "جاري الإرسال..." : "إرسال رمز التحقق"}
          </button>

          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <Link to="/" style={{ color: '#64748B', fontSize: '0.9rem', textDecoration: 'none', fontWeight: '600' }}>
               العودة لصفحة <span style={{ color: '#002B5B', fontWeight: '800' }}>تسجيل الدخول</span>
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}
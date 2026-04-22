import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { 
  LayoutDashboard, UserCheck, Clock, ShieldCheck, LogOut, BarChart3, 
  QrCode, X, User, Bell, TrendingUp, Users, Calendar
} from 'lucide-react';
import logo from "../../assets/logo.svg";

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();
  
  const employeeName = localStorage.getItem('employeeName') || 'منة فرجاني';

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/employee/today', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  useEffect(() => { 
    fetchAppointments(); 
  }, []);

  useEffect(() => {
    let scanner;
    if (showScanner) {
      scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
      scanner.render(async (decodedText) => {
        scanner.clear();
        setShowScanner(false);
        navigate(`/appointment/${decodedText}`);
      }, (err) => {});
    }
    return () => scanner?.clear().catch(() => {});
  }, [showScanner, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('employeeName');
    navigate('/'); 
  };

  return (
    <div className="admin-layout" style={{ display: 'flex', background: '#F8FAFC', minHeight: '100vh', direction: 'rtl' }}>
      
      {/* Sidebar */}
      <aside className="sidebar" style={{ width: '280px', background: '#002B5B', color: 'white', padding: '30px 20px', display: 'flex', flexDirection: 'column' }}>
        <div className="logo-section" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img src={logo} alt="Logo" style={{ width: '70px', filter: 'drop-shadow(0 0 10px rgba(197, 160, 89, 0.3))' }} />
          <h2 style={{ fontSize: '1.2rem', color: '#C5A059', marginTop: '15px', fontWeight: '800' }}>بوابة الخدمات الرقمية</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          <button className="nav-item active" onClick={() => navigate('/dashboard')}>
            <LayoutDashboard size={20} /> <span style={{marginRight: '10px'}}>لوحة التحكم</span>
          </button>

          <button className="nav-item" onClick={() => navigate('/daily-review')}>
            <UserCheck size={20} /> <span style={{marginRight: '10px'}}>المراجعة اليومية</span>
          </button>

          <button className="nav-item" onClick={() => navigate('/analytics')}>
            <BarChart3 size={20} /> <span style={{marginRight: '10px'}}>الإحصائيات الذكية</span>
          </button>

          <button className="nav-item" onClick={() => navigate('/profile')}>
            <User size={20} /> <span style={{marginRight: '10px'}}>الملف الشخصي</span>
          </button>
          
          <div style={{ marginTop: 'auto' }}>
            <button 
              className="nav-item logout-btn" 
              onClick={handleLogout} 
              style={{ 
                color: '#FF4D4D', 
                border: '1px solid rgba(255,77,77,0.2)',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'transparent',
                cursor: 'pointer',
                padding: '10px'
              }}
            >
              <LogOut size={20} /> تسجيل الخروج
            </button>
          </div>
        </nav>
      </aside>

      <main className="main-content" style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {/* Top Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ color: '#002B5B', fontSize: '2rem', fontWeight: '800', margin: 0 }}>مكتب جوازات الغربية</h1>
            <p style={{ color: '#64748B', marginTop: '5px' }}>مرحباً بكِ مجدداً، <span style={{ color: '#002B5B', fontWeight: 'bold' }}>{employeeName}</span> 👋</p>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ position: 'relative', padding: '10px', background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
              <Bell size={20} color="#64748B" />
              <span style={{ position: 'absolute', top: '5px', right: '5px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%' }}></span>
            </div>
            <button 
              onClick={() => setShowScanner(true)}
              style={{ background: '#C5A059', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 25px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(197, 160, 89, 0.3)' }}
            >
              <QrCode size={20} /> ابدأ مسح QR
            </button>
          </div>
        </header>

        {/* الإحصائيات */}
        <div className="stats-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
          <StatCard icon={<Users color="#002B5B"/>} label="إجمالي الحجوزات" value={appointments.length} trend="+5%" color="#E0F2FE" />
          <StatCard icon={<Clock color="#C5A059"/>} label="في الانتظار" value={appointments.filter(a => a.status === 'pending').length} trend="حالي" color="#FFF7ED" />
          <StatCard icon={<ShieldCheck color="#16A34A"/>} label="تم التحقق" value={appointments.filter(a => a.status === 'checked-in').length} trend="ناجح" color="#DCFCE7" />
          <StatCard icon={<TrendingUp color="#8B5CF6"/>} label="معدل الإنجاز" value="84%" trend="ممتاز" color="#F5F3FF" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
          {/* الجدول */}
          <section style={{ background: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#002B5B' }}>الحجوزات القادمة</h3>
              <button onClick={() => navigate('/daily-review')} style={{ color: '#C5A059', border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer' }}>عرض الكل</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #EDF2F7', color: '#64748B' }}>
                  <th style={{ padding: '15px' }}>المواطن</th>
                  <th style={{ padding: '15px' }}>الخدمة</th>
                  <th style={{ padding: '15px' }}>التوقيت</th>
                  <th style={{ padding: '15px' }}>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map((app) => (
                  <tr key={app._id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td style={{ padding: '15px', fontWeight: '600' }}>{app.citizenName}</td>
                    <td style={{ padding: '15px', fontSize: '0.9rem' }}>{app.service}</td>
                    <td style={{ padding: '15px', color: '#64748B' }}>{app.time}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ 
                        padding: '5px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.8rem',
                        background: app.status === 'pending' ? '#FFF7ED' : '#DCFCE7',
                        color: app.status === 'pending' ? '#C5A059' : '#16A34A'
                      }}>
                        {app.status === 'pending' ? 'إنتظار' : 'تم التحقق'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* التقويم */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <Calendar size={40} color="#C5A059" style={{ marginBottom: '10px' }} />
              <h3 style={{ margin: 0, color: '#002B5B' }}>{new Date().toLocaleDateString('ar-EG', { weekday: 'long' })}</h3>
              <p style={{ color: '#64748B', fontSize: '1.2rem' }}>{new Date().toLocaleDateString('ar-EG')}</p>
            </div>
          </section>
        </div>

        {/* Scanner Modal */}
        {showScanner && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', borderRadius: '25px', padding: '30px', width: '90%', maxWidth: '500px', position: 'relative' }}>
              <button onClick={() => setShowScanner(false)} style={{ position: 'absolute', top: '20px', left: '20px', border: 'none', background: 'none', cursor: 'pointer' }}><X/></button>
              <h3 style={{ color: '#002B5B', textAlign: 'center', marginBottom: '20px' }}>مسح رمز QR المواطن</h3>
              <div id="reader"></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const StatCard = ({ icon, label, value, trend, color }) => (
  <div style={{ 
    background: 'white',
    padding: '20px', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '20px', 
    borderRadius: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    borderRight: `5px solid ${color === '#FFF7ED' ? '#C5A059' : color === '#DCFCE7' ? '#16A34A' : '#002B5B'}`
  }}>
    <div style={{ padding: '15px', borderRadius: '15px', background: color }}>
      {icon}
    </div>
    <div>
      <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem', fontWeight: 'bold' }}>{label}</p>
      <h2 style={{ margin: '5px 0', color: '#002B5B', fontSize: '1.8rem' }}>{value}</h2>
      <span style={{ fontSize: '0.75rem', background: '#F1F5F9', padding: '2px 8px', borderRadius: '10px', color: '#64748B' }}>{trend}</span>
    </div>
  </div>
);

export default Dashboard;
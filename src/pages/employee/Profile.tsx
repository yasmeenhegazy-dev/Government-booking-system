import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Mail, Building, Contact, Shield, 
  Zap, Award, Verified, ArrowRight 
} from 'lucide-react';
// @ts-ignore
import logo from "../../assets/logo.svg";

interface InfoCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

interface ActivityRowProps {
  status: 'done' | 'pending';
  text: string;
  time: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const employeeName: string = localStorage.getItem('employeeName') || 'منة فرجاني';

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('employeeName');
    navigate('/'); 
  };

  return (
    <div className="main-content" style={{ 
      background: '#F8FAFC',
      minHeight: '100vh',
      padding: '40px',
      direction: 'rtl' 
    }}>
      
      {/* Header */}
      <header style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: '40px', background: 'white', padding: '20px 30px', 
        borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
        border: '1px solid #F1F5F9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '10px', background: '#F1F5F9', borderRadius: '15px' }}>
            <img src={logo} alt="اللوجو الرسمي" style={{ width: '50px' }} />
          </div>
          <div>
            <h1 style={{ color: '#002B5B', fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>الملف الشخصي</h1>
            <p style={{ color: '#64748B', margin: 0 }}>إدارة بيانات الحساب والصلاحيات الرسمية</p>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/dashboard')}
          style={{ 
            padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', 
            background: 'white', color: '#002B5B', cursor: 'pointer', 
            display: 'flex', alignItems: 'center', transition: '0.3s'
          }}
        >
          <ArrowRight size={22} />
        </button>
      </header>

      <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '30px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ 
            background: 'white', borderRadius: '25px',
            textAlign: 'center', padding: '40px 20px', 
            border: '1px solid #F1F5F9',
            boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
          }}>
            <div style={{ 
              width: '120px', height: '120px', borderRadius: '30px', 
              background: 'linear-gradient(135deg, #002B5B 0%, #C5A059 100%)',
              margin: '0 auto 20px', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', color: 'white', fontSize: '3.5rem',
              boxShadow: '0 15px 30px rgba(0, 43, 91, 0.2)',
              fontWeight: 'bold'
            }}>
              {employeeName.charAt(0)}
            </div>
            <h3 style={{ color: '#002B5B', margin: '0 0 5px', fontWeight: '800' }}>{employeeName}</h3>
            <span style={{ 
                fontSize: '0.8rem', background: '#DCFCE7', color: '#16A34A', 
                padding: '5px 12px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center',
                fontWeight: 'bold'
            }}>
              <Verified size={14} style={{ marginLeft: '5px' }} /> مسؤول نظام معتمد
            </span>
            
            <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#002B5B', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                 تعديل البيانات
              </button>
              <button 
                onClick={handleLogout}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#FEF2F2', color: '#EF4444', border: '1px solid #FEE2E2', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}
              >
                <LogOut size={18} style={{ marginLeft: '8px' }} /> تسجيل الخروج
              </button>
            </div>
          </div>

          <div style={{ background: '#002B5B', color: 'white', padding: '25px', borderRadius: '25px' }}>
            <h4 style={{ color: '#C5A059', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 15px' }}>
              <Award size={18} /> ملخص الأداء
            </h4>
            <div style={{ fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ opacity: 0.8 }}>دقة المسح</span>
                <span style={{ color: '#C5A059', fontWeight: 'bold' }}>98%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: '98%', height: '100%', background: '#C5A059' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <InfoCard icon={Mail} label="البريد الرسمي" value="menna.f@gov.eg" />
            <InfoCard icon={Building} label="فرع العمل" value="مكتب جوازات الغربية" />
            <InfoCard icon={Contact} label="الرقم الوظيفي" value="GOV-2026-MF88" />
            <InfoCard icon={Shield} label="الصلاحية" value="مدير نظام (Admin)" />
          </div>

          <div style={{ background: 'white', padding: '30px', borderRadius: '25px', border: '1px solid #F1F5F9', boxShadow: '0 4px 10px rgba(0,0,0,0.01)' }}>
            <h3 style={{ color: '#002B5B', margin: '0 0 25px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800' }}>
              <Zap size={22} color="#C5A059" /> سجل النشاط الأخير
            </h3>

            <div className="activity-list">
              <ActivityRow status="done" text="تم التحقق من QR الخاص بالمواطن: أحمد علي" time="منذ 5 دقائق" />
              <ActivityRow status="pending" text="محاولة دخول للنظام من متصفح Chrome" time="اليوم، 09:00 AM" />
              <ActivityRow status="done" text="تحديث إعدادات الماسح الضوئي" time="أمس، 11:20 PM" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, label, value }) => (
  <div style={{ 
    background: 'white', padding: '25px', borderRadius: '20px',
    border: '1px solid #F1F5F9', transition: 'all 0.3s ease',
    boxShadow: '0 4px 10px rgba(0,0,0,0.01)'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
      <div style={{ color: '#C5A059', background: 'rgba(197, 160, 89, 0.1)', padding: '10px', borderRadius: '12px' }}>
        <Icon size={20} />
      </div>
      <small style={{ color: '#64748B', fontWeight: '700', fontSize: '0.85rem' }}>{label}</small>
    </div>
    <p style={{ margin: '0', color: '#002B5B', fontWeight: '800', fontSize: '1.1rem' }}>{value}</p>
  </div>
);

const ActivityRow: React.FC<ActivityRowProps> = ({ status, text, time }) => (
  <div style={{ 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    padding: '18px 0', borderBottom: '1px solid #F8FAFC' 
  }}>
    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
      <div style={{ 
        width: '10px', height: '10px', borderRadius: '50%', 
        background: status === 'done' ? '#16A34A' : '#C5A059'
      }}></div>
      <p style={{ margin: 0, fontSize: '1rem', color: '#1E293B', fontWeight: '500' }}>{text}</p>
    </div>
    <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: '600' }}>{time}</span>
  </div>
);

export default Profile;
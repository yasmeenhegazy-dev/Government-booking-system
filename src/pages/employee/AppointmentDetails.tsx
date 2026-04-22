import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, FileText, MapPin, CheckCircle } from 'lucide-react';

interface Appointment {
  citizenName: string;
  service: string;
  branch: string;
  status: string;
}

const AppointmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/employee/appointment/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointment(res.data);
      } catch (err) {
        console.error("خطأ في جلب تفاصيل الحجز", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleComplete = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/employee/status/${id}`, 
        { status: 'completed' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("تم إتمام الخدمة بنجاح ✅");
      navigate('/dashboard');
    } catch (err) {
      alert("حدث خطأ أثناء التحديث");
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: '#002B5B' }}>جاري التحميل...</div>;
  if (!appointment) return <div style={{ textAlign: 'center', padding: '50px', color: '#EF4444' }}>لم يتم العثور على بيانات هذا الحجز.</div>;

  return (
    <div className="details-page" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', direction: 'rtl' }}>
      <h2 style={{ color: '#002B5B', marginBottom: '30px', fontWeight: '800' }}>تفاصيل مراجعة المواطن</h2>
      
      <div className="info-card" style={{ 
        background: 'white', 
        padding: '40px', 
        borderRadius: '25px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        border: '1px solid #F1F5F9' 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'rgba(197, 160, 89, 0.1)', padding: '10px', borderRadius: '12px' }}>
              <User size={24} color="#C5A059" />
            </div>
            <div>
              <p style={{ margin: 0, color: '#64748B', fontSize: '0.9rem' }}>اسم المواطن</p>
              <strong style={{ fontSize: '1.2rem', color: '#002B5B' }}>{appointment.citizenName}</strong>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'rgba(197, 160, 89, 0.1)', padding: '10px', borderRadius: '12px' }}>
              <FileText size={24} color="#C5A059" />
            </div>
            <div>
              <p style={{ margin: 0, color: '#64748B', fontSize: '0.9rem' }}>الخدمة المطلوبة</p>
              <strong style={{ fontSize: '1.2rem', color: '#002B5B' }}>{appointment.service}</strong>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'rgba(197, 160, 89, 0.1)', padding: '10px', borderRadius: '12px' }}>
              <MapPin size={24} color="#C5A059" />
            </div>
            <div>
              <p style={{ margin: 0, color: '#64748B', fontSize: '0.9rem' }}>الفرع</p>
              <strong style={{ fontSize: '1.2rem', color: '#002B5B' }}>{appointment.branch}</strong>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleComplete}
          style={{ 
            marginTop: '40px', width: '100%', padding: '18px', 
            background: '#16A34A', color: 'white', border: 'none', 
            borderRadius: '15px', fontSize: '1.1rem', fontWeight: '700',
            cursor: 'pointer', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', gap: '10px', transition: '0.3s',
            boxShadow: '0 4px 15px rgba(22, 163, 74, 0.2)'
          }}
        >
          <CheckCircle size={22} /> إتمام الخدمة النهائية
        </button>
      </div>
    </div>
  );
}

export default AppointmentDetails;
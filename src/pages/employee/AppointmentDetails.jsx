import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, FileText, MapPin, CheckCircle } from 'lucide-react';

function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);

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
      }
    };
    fetchDetail();
  }, [id]);

  const handleComplete = async () => {
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

  if (!appointment) return <div className="loader">جاري التحميل...</div>;

  return (
    <div className="details-page" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#002B5B', marginBottom: '30px' }}>تفاصيل مراجعة المواطن</h2>
      <div className="info-card" style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <p><User size={18} color="#C5A059" /> <strong>اسم المواطن:</strong> {appointment.citizenName}</p>
        <hr />
        <p><FileText size={18} color="#C5A059" /> <strong>الخدمة المطلوب:</strong> {appointment.service}</p>
        <hr />
        <p><MapPin size={18} color="#C5A059" /> <strong>الفرع:</strong> {appointment.branch}</p>
        
        <button 
          onClick={handleComplete}
          style={{ 
            marginTop: '30px', width: '100%', padding: '15px', 
            background: '#16A34A', color: 'white', border: 'none', 
            borderRadius: '10px', fontSize: '1.1rem', cursor: 'pointer' 
          }}
        >
          <CheckCircle size={20} /> إتمام الخدمة النهائية
        </button>
      </div>
    </div>
  );
}

export default AppointmentDetails;
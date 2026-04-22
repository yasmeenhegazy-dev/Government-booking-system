import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell 
} from 'recharts';
import { ArrowRight, TrendingUp, Users, FileBarChart, PieChart, Calendar } from 'lucide-react';
import logo from "../../assets/logo.svg";

function Analytics() {
  const navigate = useNavigate();

  const hourlyData = [
    { time: '08 AM', count: 12 }, { time: '10 AM', count: 45 },
    { time: '12 PM', count: 78 }, { time: '02 PM', count: 32 },
    { time: '04 PM', count: 15 },
  ];

  const serviceData = [
    { name: 'جواز سفر', value: 400 },
    { name: 'بطاقة رقم قومي', value: 300 },
    { name: 'شهادة ميلاد', value: 200 },
    { name: 'تصريح سفر', value: 100 },
  ];

  const COLORS = ['#002B5B', '#C5A059', '#16A34A', '#8B5CF6'];

  return (
    <div className="main-content" style={{ padding: '40px', background: '#F8FAFC', direction: 'rtl' }}>
      
      <header style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: '30px', background: 'white', padding: '20px 30px', 
        borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img src={logo} alt="Logo" style={{ width: '50px' }} />
          <div>
            <h1 style={{ color: '#002B5B', fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>مركز التحليلات الذكي</h1>
            <p style={{ color: '#64748B', margin: 0 }}>إحصائيات الأداء المباشرة لفرع العباسية</p>
          </div>
        </div>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer' }}>
          <ArrowRight size={22} />
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div className="table-wrapper" style={{ padding: '20px', borderRight: '5px solid #002B5B' }}>
          <TrendingUp color="#002B5B" size={24} />
          <h4 style={{ margin: '10px 0 5px', color: '#64748B' }}>معدل كفاءة الفرع</h4>
          <h2 style={{ margin: 0, color: '#002B5B' }}>94.2%</h2>
        </div>
        <div className="table-wrapper" style={{ padding: '20px', borderRight: '5px solid #C5A059' }}>
          <Users color="#C5A059" size={24} />
          <h4 style={{ margin: '10px 0 5px', color: '#64748B' }}>متوسط وقت الخدمة</h4>
          <h2 style={{ margin: 0, color: '#002B5B' }}>8 دقائق</h2>
        </div>
        <div className="table-wrapper" style={{ padding: '20px', borderRight: '5px solid #16A34A' }}>
          <Calendar color="#16A34A" size={24} />
          <h4 style={{ margin: '10px 0 5px', color: '#64748B' }}>توقعات الغد</h4>
          <h2 style={{ margin: 0, color: '#002B5B' }}>+120 مواطن</h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
        
        <div className="table-wrapper" style={{ padding: '25px' }}>
          <h3 style={{ marginBottom: '20px', color: '#002B5B', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileBarChart size={20} color="#C5A059" /> توزيع كثافة المواطنين (اليوم)
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#002B5B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#002B5B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="count" stroke="#002B5B" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="table-wrapper" style={{ padding: '25px' }}>
          <h3 style={{ marginBottom: '20px', color: '#002B5B', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PieChart size={20} color="#C5A059" /> توزيع أنواع الخدمات
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={serviceData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} style={{ fontSize: '0.8rem', fontWeight: 'bold' }} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={25}>
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Analytics;
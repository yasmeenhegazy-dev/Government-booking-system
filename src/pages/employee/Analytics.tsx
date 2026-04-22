import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell 
} from 'recharts';
import { ArrowRight, TrendingUp, Users, FileBarChart, PieChart, Calendar } from 'lucide-react';
// @ts-ignore
import logo from "../../assets/logo.svg";

interface HourlyData {
  time: string;
  count: number;
}

interface ServiceData {
  name: string;
  value: number;
}

const Analytics: React.FC = () => {
  const navigate = useNavigate();

  const hourlyData: HourlyData[] = [
    { time: '08 AM', count: 12 }, { time: '10 AM', count: 45 },
    { time: '12 PM', count: 78 }, { time: '02 PM', count: 32 },
    { time: '04 PM', count: 15 },
  ];

  const serviceData: ServiceData[] = [
    { name: 'جواز سفر', value: 400 },
    { name: 'بطاقة رقم قومي', value: 300 },
    { name: 'شهادة ميلاد', value: 200 },
    { name: 'تصريح سفر', value: 100 },
  ];

  const COLORS: string[] = ['#002B5B', '#C5A059', '#16A34A', '#8B5CF6'];

  return (
    <div className="main-content" style={{ padding: '40px', background: '#F8FAFC', direction: 'rtl', minHeight: '100vh' }}>
      
      <header style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: '30px', background: 'white', padding: '20px 30px', 
        borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
        border: '1px solid #F1F5F9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img src={logo} alt="Logo" style={{ width: '50px' }} />
          <div>
            <h1 style={{ color: '#002B5B', fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>مركز التحليلات الذكي</h1>
            <p style={{ color: '#64748B', margin: 0 }}>إحصائيات الأداء المباشرة - نظام الحجز الحكومي</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/dashboard')} 
          style={{ 
            padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', 
            background: 'white', cursor: 'pointer', transition: '0.3s' 
          }}
        >
          <ArrowRight size={22} color="#002B5B" />
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <StatCard icon={TrendingUp} color="#002B5B" label="معدل كفاءة الفرع" value="94.2%" />
        <StatCard icon={Users} color="#C5A059" label="متوسط وقت الخدمة" value="8 دقائق" />
        <StatCard icon={Calendar} color="#16A34A" label="توقعات الغد" value="+120 مواطن" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
        
        <div style={{ background: 'white', padding: '25px', borderRadius: '25px', border: '1px solid #F1F5F9' }}>
          <h3 style={{ marginBottom: '20px', color: '#002B5B', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800' }}>
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
                <XAxis dataKey="time" axisLine={false} tickLine={false} style={{ fontSize: '0.8rem', fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} style={{ fontSize: '0.8rem', fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="count" stroke="#002B5B" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: 'white', padding: '25px', borderRadius: '25px', border: '1px solid #F1F5F9' }}>
          <h3 style={{ marginBottom: '20px', color: '#002B5B', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800' }}>
            <PieChart size={20} color="#C5A059" /> أنواع الخدمات الأكثر طلباً
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={serviceData} layout="vertical" margin={{ right: 30 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100} 
                  axisLine={false} 
                  tickLine={false} 
                  style={{ fontSize: '0.85rem', fontWeight: 'bold', fill: '#1E293B' }} 
                />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
                  {serviceData.map((_entry, index) => (
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

interface StatCardProps {
  icon: React.ElementType;
  color: string;
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, color, label, value }) => (
  <div style={{ 
    background: 'white', padding: '25px', borderRadius: '20px', 
    borderRight: `6px solid ${color}`, boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
    borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', borderLeft: '1px solid #F1F5F9'
  }}>
    <Icon color={color} size={28} />
    <h4 style={{ margin: '15px 0 5px', color: '#64748B', fontWeight: '600' }}>{label}</h4>
    <h2 style={{ margin: 0, color: '#002B5B', fontWeight: '900', fontSize: '1.8rem' }}>{value}</h2>
  </div>
);

export default Analytics;
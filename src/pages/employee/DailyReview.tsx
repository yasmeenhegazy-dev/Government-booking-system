import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { 
  Search, Clock, Download, ArrowRight, ExternalLink, FileText 
} from 'lucide-react';
// @ts-ignore
import logo from "../../assets/logo.svg";

interface DailyAppointment {
  id: string;
  name: string;
  service: string;
  time: string;
  status: 'checked-in' | 'pending';
  nationalId: string;
}

const DailyReview: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [dailyData] = useState<DailyAppointment[]>([
    { id: '101', name: 'أحمد محمد علي', service: 'تجديد جواز سفر', time: '09:00 AM', status: 'checked-in', nationalId: '2950101XXXXX' },
    { id: '102', name: 'سارة محمود حسن', service: 'تجديد بطاقة رقم قومي', time: '10:30 AM', status: 'pending', nationalId: '2980520XXXXX' },
    { id: '103', name: 'ليلى إبراهيم كمال', service: 'تصريح سفر', time: '11:15 AM', status: 'checked-in', nationalId: '2920315XXXXX' },
    { id: '104', name: 'ياسين عمر فاروق', service: 'شهادة ميلاد المميكنة', time: '12:00 PM', status: 'pending', nationalId: '3100812XXXXX' },
  ]);

  const exportToExcel = (): void => {
    const dataToExport = dailyData.map(item => ({
      'اسم المواطن': item.name,
      'الرقم القومي': item.nationalId,
      'الخدمة': item.service,
      'التوقيت': item.time,
      'الحالة': item.status === 'checked-in' ? 'تم التحقق' : 'إنتظار'
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DailyReview");
    XLSX.writeFile(workbook, `Report_${new Date().toLocaleDateString('en-GB')}.xlsx`);
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      padding: '40px',
      background: '#F8FAFC',
      minHeight: '100vh',
      direction: 'rtl',
    },
    headerCard: {
      background: 'white',
      padding: '25px 30px',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '40px',
      border: '1px solid #F1F5F9'
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    backBtn: {
      padding: '12px',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      background: 'white',
      color: '#002B5B',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center'
    },
    searchBar: {
      position: 'relative',
      marginBottom: '30px'
    },
    searchInput: {
      width: '100%',
      padding: '18px 55px 18px 25px',
      borderRadius: '15px',
      border: '1px solid #E2E8F0',
      fontSize: '1rem',
      outline: 'none'
    },
    tableWrapper: {
      background: 'white',
      borderRadius: '20px',
      padding: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
      border: '1px solid #F1F5F9',
      overflowX: 'auto'
    },
    th: {
      textAlign: 'right',
      padding: '18px',
      borderBottom: '2px solid #F1F5F9',
      color: '#64748B',
      fontWeight: '600'
    },
    actionBtn: {
      padding: '10px',
      borderRadius: '10px',
      border: '1px solid #E2E8F0',
      background: '#F8FAFC',
      color: '#002B5B',
      cursor: 'pointer',
      marginLeft: '5px'
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.headerCard}>
        <div style={styles.logoSection}>
          <div style={{ padding: '12px', background: '#F1F5F9', borderRadius: '15px' }}>
            <img src={logo} alt="Logo" style={{ width: '50px' }} />
          </div>
          <div>
            <h1 style={{ color: '#002B5B', fontSize: '2rem', fontWeight: '800', margin: 0 }}>المراجعة اليومية</h1>
            <p style={{ color: '#64748B', margin: '5px 0 0 0' }}>تاريخ اليوم: {new Date().toLocaleDateString('ar-EG')}</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={exportToExcel}
            style={{ ...styles.backBtn, background: '#16A34A', color: 'white', border: 'none', padding: '12px 20px', fontWeight: '600' }}
          >
            <Download size={18} style={{ marginLeft: '10px' }} />
            تصدير Excel
          </button>
          <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
            <ArrowRight size={20} />
          </button>
        </div>
      </header>

      <div style={styles.searchBar}>
        <Search style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} size={22} />
        <input 
          type="text" 
          placeholder="ابحث بالاسم، الرقم القومي، أو نوع الخدمة..." 
          style={styles.searchInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={styles.tableWrapper}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={styles.th}>المواطن</th>
              <th style={styles.th}>الرقم القومي</th>
              <th style={styles.th}>نوع الخدمة</th>
              <th style={styles.th}>التوقيت</th>
              <th style={styles.th}>الحالة</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>الإجراء</th>
            </tr>
          </thead>
          <tbody>
            {dailyData.filter(item => 
              item.name.includes(searchTerm) || 
              item.service.includes(searchTerm) || 
              item.nationalId.includes(searchTerm)
            ).map((row) => (
              <tr key={row.id}>
                <td style={{ padding: '18px', borderBottom: '1px solid #F1F5F9', fontWeight: '700' }}>{row.name}</td>
                <td style={{ padding: '18px', borderBottom: '1px solid #F1F5F9', color: '#64748B' }}>{row.nationalId}</td>
                <td style={{ padding: '18px', borderBottom: '1px solid #F1F5F9' }}>{row.service}</td>
                <td style={{ padding: '18px', borderBottom: '1px solid #F1F5F9' }}><Clock size={14} style={{ marginLeft: '5px' }} /> {row.time}</td>
                <td style={{ padding: '18px', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    background: row.status === 'checked-in' ? '#DCFCE7' : '#FFF7ED',
                    color: row.status === 'checked-in' ? '#16A34A' : '#C5A059'
                  }}>
                    {row.status === 'checked-in' ? 'تم التحقق' : 'إنتظار'}
                  </span>
                </td>
                <td style={{ padding: '18px', borderBottom: '1px solid #F1F5F9', textAlign: 'center' }}>
                    <button onClick={() => navigate(`/appointment/${row.id}`)} style={styles.actionBtn}><ExternalLink size={18} /></button>
                    <button style={styles.actionBtn}><FileText size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DailyReview;
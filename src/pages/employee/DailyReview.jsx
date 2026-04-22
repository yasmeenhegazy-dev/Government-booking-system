import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { 
  Search, Filter, Download, CheckCircle, Clock, 
  AlertCircle, Printer, ArrowRight, ExternalLink, FileText 
} from 'lucide-react';
import logo from "../../assets/logo.svg";

function DailyReview() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const [dailyData] = useState([
    { id: '101', name: 'أحمد محمد علي', service: 'تجديد جواز سفر', time: '09:00 AM', status: 'checked-in', nationalId: '2950101XXXXX' },
    { id: '102', name: 'سارة محمود حسن', service: 'تجديد بطاقة رقم قومي', time: '10:30 AM', status: 'pending', nationalId: '2980520XXXXX' },
    { id: '103', name: 'ليلى إبراهيم كمال', service: 'تصريح سفر', time: '11:15 AM', status: 'checked-in', nationalId: '2920315XXXXX' },
    { id: '104', name: 'ياسين عمر فاروق', service: 'شهادة ميلاد المميكنة', time: '12:00 PM', status: 'pending', nationalId: '3100812XXXXX' },
  ]);

  const exportToExcel = () => {
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

  const styles = {
    container: {
      padding: '40px',
      background: '#F8FAFC',
      minHeight: '100vh',
      direction: 'rtl', 
      fontFamily: "'Tajawal', sans-serif"
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
    logoBox: {
      padding: '12px',
      background: '#F1F5F9',
      borderRadius: '15px'
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
    searchIcon: {
      position: 'absolute',
      right: '18px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94A3B8'
    },
    tableWrapper: {
      background: 'white',
      borderRadius: '20px',
      padding: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
      border: '1px solid #F1F5F9'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      textAlign: 'right',
      padding: '18px',
      borderBottom: '2px solid #F1F5F9',
      color: '#64748B',
      fontWeight: '600'
    },
    td: {
      padding: '18px',
      borderBottom: '1px solid #F1F5F9',
      color: '#1E293B',
      fontSize: '0.95rem'
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
          <div style={styles.logoBox}>
            <img src={logo} alt="اللوجو الرسمي" style={{ width: '50px' }} />
          </div>
          <div>
            <h1 style={{ color: '#002B5B', fontSize: '2rem', fontWeight: '800', margin: 0 }}>المراجعة اليومية</h1>
            <p style={{ color: '#64748B', margin: '5px 0 0 0' }}>إدارة ومتابعة طلبات المواطنين بتاريخ {new Date().toLocaleDateString('ar-EG')}</p>
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
        <Search style={styles.searchIcon} size={22} />
        <input 
          type="text" 
          placeholder="ابحث بالاسم، الرقم القومي، أو نوع الخدمة..." 
          style={styles.searchInput}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
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
            {dailyData.filter(item => item.name.includes(searchTerm) || item.service.includes(searchTerm)).map((row) => (
              <tr key={row.id}>
                <td style={{ ...styles.td, fontWeight: '700' }}>{row.name}</td>
                <td style={{ ...styles.td, color: '#64748B' }}>{row.nationalId}</td>
                <td style={styles.td}>{row.service}</td>
                <td style={styles.td}><Clock size={14} style={{ marginLeft: '5px' }} /> {row.time}</td>
                <td style={styles.td}>
                  <span className={`status-label ${row.status === 'checked-in' ? 'done' : 'pending'}`}>
                    {row.status === 'checked-in' ? 'تم التحقق' : 'إنتظار'}
                  </span>
                </td>
                <td style={{ ...styles.td, textAlign: 'center' }}>
                    <button 
                      onClick={() => navigate(`/appointment/${row.id}`)}
                      style={styles.actionBtn}
                      title="عرض التفاصيل"
                    >
                      <ExternalLink size={18} />
                    </button>
                    <button style={styles.actionBtn} title="تعديل">
                      <FileText size={18} />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
         <div style={{ ...styles.tableWrapper, flex: 1, padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748B' }}>إجمالي معاملات اليوم:</span>
            <strong style={{ color: '#002B5B', fontSize: '1.5rem' }}>142</strong>
         </div>
         <div style={{ ...styles.tableWrapper, flex: 1, padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#16A34A' }}>تم إنجازها (Checked-in):</span>
            <strong style={{ color: '#16A34A', fontSize: '1.5rem' }}>89</strong>
         </div>
      </footer>
    </div>
  );
}

export default DailyReview;
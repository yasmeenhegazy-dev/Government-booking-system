import { useState, useEffect } from 'react'
import './index.css'

function App() {
  const [tab, setTab] = useState('المستخدمين')
  const [show, setShow] = useState(false)
  const [value, setValue] = useState('')
  const [search, setSearch] = useState('')
  const [alertMsg, setAlertMsg] = useState('')

  const [data, setData] = useState({
    المستخدمين: [],
    الخدمات: [],
    الفروع: [],
    الأدوار: []
  })

  useEffect(() => {
    fetch('http://localhost:5000/api/data')
      .then(response => response.json())
      .then(backendData => {
        setData(backendData);
      })
      .catch(error => {
        setAlertMsg('فشل الاتصال بالخادم عند جلب البيانات');
        console.log('حدث خطأ:', error);
      });
  }, []); 
  
  function addItem() {
    if (value === '') {
      setAlertMsg('الرجاء إدخال البيانات')
      return
    }

    let arr = [...data[tab]]
    if (arr.includes(value)) {
      setAlertMsg('تم إضافته من قبل')
      return
    }
    const newInfo = {
      category: tab,
      item: value
    };
    fetch('http://localhost:5000/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newInfo)
    })
      .then(response => response.json())
      .then(updatedData => {
        //تحديث البيانات في الصفحة 
        setData(updatedData);
        setValue('');
        setShow(false);
      })
      .catch(error => {
        setAlertMsg('فشل الاتصال بالخادم أثناء الحفظ، يرجى التأكد من تشغيله');
        console.log('حدث خطأ أثناء الحفظ:', error);
      });
  }

  let list = data[tab].filter((item) => {
    return item.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div>
      {/* navbar */}
      <div className="navbar">
        <img src="/gov-logo.svg" className="logo" />
        <h2>بوابة الحكومة الرقمية</h2>
      </div>

      <div className="page-container">
        {/* sidebar */}
        <div className="sidebar">
          <div onClick={() => setTab('المستخدمين')} className={tab === 'المستخدمين' ? 'active menu-item' : 'menu-item'}>
            المستخدمين
          </div>

          <div onClick={() => setTab('الخدمات')} className={tab === 'الخدمات' ? 'active menu-item' : 'menu-item'}>
            الخدمات
          </div>

          <div onClick={() => setTab('الفروع')} className={tab === 'الفروع' ? 'active menu-item' : 'menu-item'}>
            الفروع
          </div>

          <div onClick={() => setTab('الأدوار')} className={tab === 'الأدوار' ? 'active menu-item' : 'menu-item'}>
            الأدوار
          </div>
        </div>

        {/* content */}
        <div className="content">
          <div className="top-bar">
            <h1>إداره-{tab}</h1>
            <button onClick={() => setShow(true)}>إضافة</button>
          </div>

          <input
            placeholder="بحث..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div style={{ marginTop: '20px' }}>
            {list.length === 0 ? (
              <p></p>
            ) : (
              list.map((item, i) => (
                <div key={i} className="box">
                  {item}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* modal */}
      {show && (
        <div className="modal">
          <div className="modal-box">
            <div className="modal-header">
              <h3>إضافة {tab} جديد</h3>
              <button className="close-btn" onClick={() => setShow(false)}>✕</button>
            </div>

            <div className="modal-body">
              <label className="input-label">الاسم / الوصف</label>
              <input
                placeholder={`أدخل بيانات ${tab}...`}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>

            <div className="modal-footer">
              <button className="save-btn" onClick={addItem}>حفظ البيانات</button>
              <button className="cancel-btn" onClick={() => setShow(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* alert modal */}
      {alertMsg && (
        <div className="modal">
          <div className="modal-box" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '20px' }}>{alertMsg}</h3>
            <button onClick={() => setAlertMsg('')}>موافق</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

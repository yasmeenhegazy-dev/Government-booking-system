import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

//database 

 let data = {
  'المستخدمين': [],
  'الخدمات': [],
  'الفروع': [],
  'الأدوار': []
};


app.get('/api/data', (req, res) => {
  try {
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

    app.post('/api/data', (req, res) => {
  try {
    
    const category = req.body.category;
    const item = req.body.item;

    if (data[category] !== undefined) {
      data[category].push(item);
      res.json(data);
    } else {
      res.status(400).json({ message: 'القسم غير موجود' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


const PORT = process.env.PORT || 5000;

   app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
});

import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();

// لیست کاربران تستی (در حافظه)
const users = [
  { email: 'test@example.com', password: '123456', username: 'testuser' }
];

// تنظیمات CORS
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));

// پارس کردن JSON
app.use(express.json());

// Middleware برای لاگ کردن درخواست‌ها
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request Body:', req.body);
  next();
});

// ثبت‌نام کاربر جدید
app.post('/api/users', async (req, res) => {
  try {
    if (!req.body.user || !req.body.user.email || !req.body.user.password || !req.body.user.username) {
      return res.status(422).json({
        errors: {
          body: ['Invalid request body. Required fields: email, password, username']
        }
      });
    }
    // بررسی تکراری نبودن ایمیل
    if (users.find(u => u.email === req.body.user.email)) {
      return res.status(409).json({
        errors: {
          body: ['Email already exists']
        }
      });
    }
    // افزودن کاربر جدید
    users.push({
      email: req.body.user.email,
      password: req.body.user.password,
      username: req.body.user.username
    });
    const mockResponse = {
      user: {
        email: req.body.user.email,
        token: 'mock-jwt-token-' + Date.now(),
        username: req.body.user.username,
        bio: null,
        image: null
      }
    };
    res.json(mockResponse);
  } catch (error) {
    res.status(500).json({
      errors: {
        body: ['Internal server error']
      }
    });
  }
});

// ورود کاربر
app.post('/api/users/login', async (req, res) => {
  try {
    let userData = req.body;
    if (!userData.user) {
      userData = {
        user: {
          email: req.body.username,
          password: req.body.password
        }
      };
    }
    if (!userData.user || !userData.user.email || !userData.user.password) {
      return res.status(422).json({
        errors: {
          body: ['Invalid request body. Required fields: email, password']
        }
      });
    }
    // اعتبارسنجی کاربر
    const found = users.find(
      u => u.email === userData.user.email && u.password === userData.user.password
    );
    if (!found) {
      return res.status(403).json({
        errors: {
          body: ['Invalid email or password']
        }
      });
    }
    const mockResponse = {
      user: {
        email: found.email,
        token: 'mock-jwt-token-' + Date.now(),
        username: found.username,
        bio: null,
        image: null
      }
    };
    res.json(mockResponse);
  } catch (error) {
    res.status(500).json({
      errors: {
        body: ['Internal server error']
      }
    });
  }
});

// Route برای دریافت مقالات
app.get('/api/articles', async (req, res) => {
  try {
    // Mock articles response
    const mockResponse = {
      articles: [
        {
          slug: 'how-to-train-your-dragon',
          title: 'How to train your dragon',
          description: 'Ever wonder how?',
          body: 'It takes a Jacobian',
          tagList: ['dragons', 'training'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          favorited: false,
          favoritesCount: 0,
          author: {
            username: 'jake',
            bio: null,
            image: 'https://i.stack.imgur.com/xHWG8.jpg',
            following: false
          }
        },
        {
          slug: 'how-to-train-your-dragon',
          title: 'How to train your dragon',
          description: 'Ever wonder how?',
          body: 'It takes a Jacobian',
          tagList: ['dragons', 'training'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          favorited: false,
          favoritesCount: 0,
          author: {
            username: 'jake',
            bio: null,
            image: 'https://i.stack.imgur.com/xHWG8.jpg',
            following: false
          }
        }
      ],
      articlesCount: 1
    };

    res.json(mockResponse);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      errors: {
        body: ['Internal server error']
      }
    });
  }
});

// گرفتن اطلاعات کاربر لاگین شده
app.get('/api/user', (req, res) => {
  // توکن را از هدر Authorization بگیر
  const auth = req.headers['authorization'] || '';
  const token = auth.replace('Bearer ', '');
  // کاربر را بر اساس توکن پیدا کن (در mock فقط آخرین کاربر ثبت‌نام شده را برمی‌گردانیم)
  // در حالت واقعی باید توکن را دیکد کنی، اینجا فقط برای تست است
  const user = users.find(u => token && token.startsWith('mock-jwt-token')) || users[users.length - 1];
  if (!user) {
    return res.status(401).json({ errors: { body: ['User not found or not logged in'] } });
  }
  res.json({
    user: {
      email: user.email,
      username: user.username,
      bio: null,
      image: null
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`CORS enabled for: http://localhost:5174`);
}); 
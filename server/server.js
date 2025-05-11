const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store
const users = [];
const articles = [];
const comments = [];
const tags = new Set(['react', 'angular', 'vue', 'node', 'express', 'javascript']);

// Helper functions
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({});
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({});
    }
    req.user = user;
    next();
  });
};

// Helper function to manage tags
const manageTags = (tagList) => {
  if (Array.isArray(tagList)) {
    tagList.forEach(tag => {
      if (typeof tag === 'string' && tag.trim()) {
        tags.add(tag.trim());
      }
    });
  }
};

// User and Authentication endpoints
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body.user;
  const user = users.find(u => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({
      errors: {
        body: ['Invalid email or password']
      }
    });
  }

  const token = generateToken(user);
  res.json({
    user: {
      email: user.email,
      token,
      username: user.username,
      bio: user.bio || '',
      image: user.image || ''
    }
  });
});

app.post('/api/users', async (req, res) => {
  const { username, email, password } = req.body.user;

  if (users.some(u => u.email === email)) {
    return res.status(422).json({
      errors: {
        body: ['Email already taken']
      }
    });
  }

  if (users.some(u => u.username === username)) {
    return res.status(422).json({
      errors: {
        body: ['Username already taken']
      }
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    username,
    email,
    password: hashedPassword,
    bio: '',
    image: ''
  };

  users.push(newUser);
  const token = generateToken(newUser);

  res.status(201).json({
    user: {
      email: newUser.email,
      token,
      username: newUser.username,
      bio: newUser.bio,
      image: newUser.image
    }
  });
});

app.get('/api/user', authenticateToken, (req, res) => {
  const user = users.find(u => u.email === req.user.email);
  if (!user) {
    return res.status(401).json({});
  }

  res.json({
    user: {
      email: user.email,
      token: req.headers.authorization.split(' ')[1],
      username: user.username,
      bio: user.bio,
      image: user.image
    }
  });
});

app.put('/api/user', authenticateToken, async (req, res) => {
  const { email, password, username, bio, image } = req.body.user;
  const user = users.find(u => u.email === req.user.email);

  if (!user) {
    return res.status(401).json({});
  }

  if (email && email !== user.email && users.some(u => u.email === email)) {
    return res.status(422).json({
      errors: {
        body: ['Email already taken']
      }
    });
  }

  if (username && username !== user.username && users.some(u => u.username === username)) {
    return res.status(422).json({
      errors: {
        body: ['Username already taken']
      }
    });
  }

  user.email = email || user.email;
  user.username = username || user.username;
  user.bio = bio || user.bio;
  user.image = image || user.image;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  res.json({
    user: {
      email: user.email,
      token: req.headers.authorization.split(' ')[1],
      username: user.username,
      bio: user.bio,
      image: user.image
    }
  });
});

// Articles endpoints
app.get('/api/articles', (req, res) => {
  const { tag, author, favorited, limit = 20, offset = 0 } = req.query;
  let filteredArticles = [...articles];

  if (tag) {
    filteredArticles = filteredArticles.filter(article => 
      article.tagList.includes(tag)
    );
  }

  if (author) {
    filteredArticles = filteredArticles.filter(article => 
      article.author.username === author
    );
  }

  if (favorited) {
    filteredArticles = filteredArticles.filter(article => 
      article.favorited
    );
  }

  const paginatedArticles = filteredArticles.slice(offset, offset + limit);

  res.json({
    articles: paginatedArticles,
    articlesCount: filteredArticles.length
  });
});

app.post('/api/articles', authenticateToken, (req, res) => {
  const { title, description, body, tagList } = req.body.article;
  const user = users.find(u => u.email === req.user.email);

  const slug = title.toLowerCase().replace(/\s+/g, '-');
  if (articles.some(a => a.slug === slug)) {
    return res.status(422).json({
      errors: {
        body: ['Article with this title already exists']
      }
    });
  }

  // Manage tags
  manageTags(tagList);

  const newArticle = {
    slug,
    title,
    description,
    body,
    tagList: tagList || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    favorited: false,
    favoritesCount: 0,
    author: {
      username: user.username,
      bio: user.bio,
      image: user.image,
      following: false
    }
  };

  articles.unshift(newArticle);
  res.status(201).json({ article: newArticle });
});

app.get('/api/articles/:slug', (req, res) => {
  const article = articles.find(a => a.slug === req.params.slug);
  if (!article) {
    return res.status(422).json({
      errors: {
        body: ['Article not found']
      }
    });
  }

  res.json({ article });
});

app.put('/api/articles/:slug', authenticateToken, (req, res) => {
  const { title, description, body, tagList } = req.body.article;
  const article = articles.find(a => a.slug === req.params.slug);

  if (!article) {
    return res.status(422).json({
      errors: {
        body: ['Article not found']
      }
    });
  }

  if (article.author.username !== users.find(u => u.email === req.user.email).username) {
    return res.status(401).json({});
  }

  if (title) {
    article.title = title;
    article.slug = title.toLowerCase().replace(/\s+/g, '-');
  }
  if (description !== undefined) article.description = description;
  if (body !== undefined) article.body = body;
  
  if (Array.isArray(tagList)) {
    // Manage tags
    manageTags(tagList);
    article.tagList = tagList;
  }
  
  article.updatedAt = new Date().toISOString();

  res.json({ article });
});

app.delete('/api/articles/:slug', authenticateToken, (req, res) => {
  const articleIndex = articles.findIndex(a => a.slug === req.params.slug);
  if (articleIndex === -1) {
    return res.status(422).json({
      errors: {
        body: ['Article not found']
      }
    });
  }

  const article = articles[articleIndex];
  if (article.author.username !== users.find(u => u.email === req.user.email).username) {
    return res.status(401).json({});
  }

  articles.splice(articleIndex, 1);
  res.status(200).json({});
});

// Tags endpoint
app.get('/api/tags', (req, res) => {
  res.json({ tags: Array.from(tags).sort((a, b) => a.localeCompare(b)) });
});

// Profile endpoints
app.get('/api/profiles/:username', (req, res) => {
  const user = users.find(u => u.username === req.params.username);
  if (!user) {
    return res.status(422).json({
      errors: {
        body: ['Profile not found']
      }
    });
  }

  res.json({
    profile: {
      username: user.username,
      bio: user.bio,
      image: user.image,
      following: false
    }
  });
});

app.post('/api/profiles/:username/follow', authenticateToken, (req, res) => {
  const user = users.find(u => u.username === req.params.username);
  if (!user) {
    return res.status(422).json({
      errors: {
        body: ['Profile not found']
      }
    });
  }

  res.json({
    profile: {
      username: user.username,
      bio: user.bio,
      image: user.image,
      following: true
    }
  });
});

app.delete('/api/profiles/:username/follow', authenticateToken, (req, res) => {
  const user = users.find(u => u.username === req.params.username);
  if (!user) {
    return res.status(422).json({
      errors: {
        body: ['Profile not found']
      }
    });
  }

  res.json({
    profile: {
      username: user.username,
      bio: user.bio,
      image: user.image,
      following: false
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}`);
}); 
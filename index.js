const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const port = process.env.PORT || 5000;

// Log MongoDB URL for debugging (remove in prod)
console.log('MongoDB URL:', process.env.MONGODB_URL);

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://springfall-usa.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('CORS Origin:', origin); // debug log
    if (!origin) return callback(null, true); // allow REST clients like Postman
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions));

// Enable pre-flight requests for all routes
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Routes
const blogRoutes = require('./src/routes/blog.route');
app.use('/api/blogs', blogRoutes);

const commentRoutes = require('./src/routes/comment.route');
app.use('/api/comments', commentRoutes);

const userRoutes = require('./src/routes/auth.route');
app.use('/api/auth', userRoutes);

// Connect to MongoDB
async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}
main();

// Root test route
app.get('/', (req, res) => {
  res.send('USA Fall Community....!');
});

// 404 error handler
app.use((req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const port = process.env.PORT || 5000;

// CORS configuration - allow only your frontend origin
const corsOptions = {
  origin: 'https://springfall-usa.vercel.app',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],  // PATCH added
};

app.use(cors(corsOptions));
// Fix CORS preflight for all routes and methods
app.options('*', cors(corsOptions));


// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Import routes
const blogRoutes = require('./src/routes/blog.route');
app.use('/api/blogs', blogRoutes);

const commentRoutes = require('./src/routes/comment.route');
app.use('/api/comments', commentRoutes);

const userRoutes = require('./src/routes/auth.route');
app.use('/api/auth', userRoutes);

// MongoDB connection
async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('MongoDB connected successfully...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}
main();

// Root route (test)
app.get('/', (req, res) => {
  res.send('USA Fall Community....!');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

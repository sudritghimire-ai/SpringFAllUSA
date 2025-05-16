const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const port = process.env.PORT || 5000;

// Logs the MongoDB URL (for debugging)
console.log('MongoDB URL:', process.env.MONGODB_URL);

// List of allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://springfall-usa.vercel.app'
];

// CORS options with dynamic origin check
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin like Postman or curl
    if (!origin) return callback(null, true);

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

// Use CORS middleware with the options
app.use(cors(corsOptions));

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
    console.log('Mongo is connected successfully...');
  } catch (err) {
    console.log('Error connecting to MongoDB:', err);
  }
}

main();

// Root route (testing server)
app.get('/', (req, res) => {
  res.send('USA Fall Community....!');
});

// Error handling for undefined routes
app.use((req, res, next) => {
  res.status(404).send({ message: 'Route not found' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

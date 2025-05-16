const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const port = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'https://springfall-usa.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('CORS origin:', origin);
    if (!origin) return callback(null, true); // allow curl/Postman
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const blogRoutes = require('./src/routes/blog.route');
app.use('/api/blogs', blogRoutes);

const commentRoutes = require('./src/routes/comment.route');
app.use('/api/comments', commentRoutes);

const userRoutes = require('./src/routes/auth.route');
app.use('/api/auth', userRoutes);

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}
main();

app.get('/', (req, res) => {
  res.send('USA Fall Community....!');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

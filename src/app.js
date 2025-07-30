const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const feedbackRoutes = require('./routes/feedback');
const authMiddleware = require('./middlewares/auth');
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/feedbacks', authMiddleware.verifyToken, (req, res, next) => {
  console.log('localhost:5000/api/feedbacks hit:', req.method);
  console.log('[APP] /api/feedbacks route hit:', req.method);
  next();
}, feedbackRoutes);

const uploadRoutes = require('./routes/test');
app.use('/api/upload', uploadRoutes);

module.exports = app;
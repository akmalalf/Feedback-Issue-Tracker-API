const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// --- Security & basics ---
app.use(helmet());
app.use(cors({
  origin: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
  credentials: true,
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// --- Serve uploads (DEV/TEST) ---
// if (process.env.NODE_ENV !== 'production') {
//   app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// }

// --- Healthz ---
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// --- swagger ---
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Routes (pakai nama konsisten) ---
app.use('/api/auth', require('./routes/auth'));           // pastikan file ini ada
app.use('/api/feedbacks', require('./routes/feedback'));  // pastikan file ini ada

// --- 404 & Error handler ---
app.use((req, res, next) => {
  const e = new Error('Route not found');
  e.status = 404; e.code = 'NOT_FOUND'; e.expose = true;
  next(e);
});
const errorHandler = require('./middlewares/error-handler'); // pastikan nama file PERSIS
app.use(errorHandler);

module.exports = app;

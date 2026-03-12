import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import env from './config/env.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true
  })
);

// Logging
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Rate limiting (basic global limiter, can be refined per route later)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api', apiLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: { status: 'ok' },
    message: 'Service is healthy'
  });
});

// Auth routes
app.use('/api/auth', authRoutes);
// Project routes (require auth)
app.use('/api/projects', projectRoutes);

// API routes placeholder (other routes in later phases)
app.use('/api', (req, res) => {
  res.json({
    success: true,
    data: { message: 'API root - implement routes in later phases' },
    message: ''
  });
});

// 404 + error handler
app.use(notFoundHandler);
app.use(errorHandler);

export default app;


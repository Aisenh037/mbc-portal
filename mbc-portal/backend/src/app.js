// app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

// --- FIX: Import all routes from the index file ---
import * as routes from './routes/index.js';

import { notFound, errorHandler } from './middleware/error.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- Middleware (remains the same) ---
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
  credentials: true
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body, { replaceWith: '_' });
  if (req.params) req.params = mongoSanitize.sanitize(req.params, { replaceWith: '_' });
  next();
});
const limiter = rateLimit({
  windowMs: Number(env.RATE_LIMIT_WINDOW_MS),
  max: Number(env.RATE_LIMIT_MAX)
});
app.use(limiter);

// --- FIX: This line is removed as it's not used by Cloudinary ---
// app.use('/uploads', express.static(path.join(__dirname, '..', env.UPLOAD_DIR)));

// Swagger docs
const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'swagger.yaml'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- FIX: Use the 'routes' object for cleaner routing ---
app.use('/api/auth', routes.authRoutes);
app.use('/api/academic', routes.academicRoutes);
app.use('/api/finance', routes.financeRoutes);
app.use('/api/notices', routes.noticeRoutes);
app.use('/api/exams', routes.examRoutes);
app.use('/api/assignments', routes.assignmentRoutes);
app.use('/api/research', routes.researchRoutes);
app.use('/api/analytics', routes.analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'backend', env: env.NODE_ENV });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
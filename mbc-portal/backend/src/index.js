import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { connectToDatabase } from './config/db.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

// Routes
import authRoutes from './routes/auth.routes.js';
import academicRoutes from './routes/academic.routes.js';
import financeRoutes from './routes/finance.routes.js';
import noticeRoutes from './routes/notice.routes.js';
import examRoutes from './routes/exam.routes.js';
import assignmentRoutes from './routes/assignment.routes.js';
import researchRoutes from './routes/research.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

import { notFound, errorHandler } from './middleware/error.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security and parsers
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
  credentials: true
}));
app.use(xss());
app.use(mongoSanitize());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

const limiter = rateLimit({
  windowMs: Number(env.RATE_LIMIT_WINDOW_MS),
  max: Number(env.RATE_LIMIT_MAX)
});
app.use(limiter);

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '..', env.UPLOAD_DIR)));

// Swagger docs
const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'swagger.yaml'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'backend', env: env.NODE_ENV });
});

app.use(notFound);
app.use(errorHandler);

const port = Number(env.PORT);

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
});
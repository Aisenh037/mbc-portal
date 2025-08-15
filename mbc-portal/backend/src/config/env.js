import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend/.env first, then fall back to repo-root .env
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '..', '..', '.env') });

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
	PORT: z.string().default('5000'),
	MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
	CLIENT_URL: z.string().min(1).default('http://localhost:5173'),
	JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 chars'),
	JWT_EXPIRES_IN: z.string().default('15m'),
	REFRESH_TOKEN_SECRET: z.string().min(32, 'REFRESH_TOKEN_SECRET must be at least 32 chars'),
	REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
	SMTP_HOST: z.string().default('localhost'),
	SMTP_PORT: z.string().default('1025'),
	SMTP_USER: z.string().default(''),
	SMTP_PASS: z.string().default(''),
	EMAIL_FROM: z.string().default('no-reply@example.com'),
	CORS_ORIGIN: z.string().default('*'),
	RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
	RATE_LIMIT_MAX: z.string().default('200'),
	UPLOAD_DIR: z.string().default('uploads'),
	S3_ENABLE: z.string().default('false'),
	S3_REGION: z.string().default(''),
	S3_BUCKET: z.string().default(''),
	S3_ACCESS_KEY_ID: z.string().default(''),
	S3_SECRET_ACCESS_KEY: z.string().default(''),
	PY_SERVICE_URL: z.string().default('http://localhost:8000')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
	process.exit(1);
}

export const env = parsed.data;
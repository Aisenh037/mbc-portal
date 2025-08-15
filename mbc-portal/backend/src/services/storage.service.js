import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadRoot = path.join(__dirname, '..', '..', env.UPLOAD_DIR);
if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

const s3Client = env.S3_ENABLE === 'true' ? new S3Client({
  region: env.S3_REGION,
  credentials: env.S3_ACCESS_KEY_ID && env.S3_SECRET_ACCESS_KEY ? {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY
  } : undefined
}) : null;

export async function saveLocal(file) {
  // Multer handles local saving; return path
  return `/uploads/${file.filename}`;
}

export async function saveToS3(file) {
  if (!s3Client) throw new Error('S3 not enabled');
  const key = `${Date.now()}-${file.originalname}`;
  const input = {
    Bucket: env.S3_BUCKET,
    Key: key,
    Body: fs.readFileSync(file.path ?? path.join(uploadRoot, file.filename)),
    ContentType: file.mimetype
  };
  await s3Client.send(new PutObjectCommand(input));
  return `https://${env.S3_BUCKET}.s3.${env.S3_REGION}.amazonaws.com/${key}`;
}

export async function persistFile(file) {
  if (env.S3_ENABLE === 'true') return saveToS3(file);
  return saveLocal(file);
}
import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporter;

export function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      secure: Number(env.SMTP_PORT) === 465,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined
    });
  }
  return transporter;
}

export async function sendEmail({ to, subject, html }) {
  const tx = getTransporter();
  const info = await tx.sendMail({ from: env.EMAIL_FROM, to, subject, html });
  return info;
}
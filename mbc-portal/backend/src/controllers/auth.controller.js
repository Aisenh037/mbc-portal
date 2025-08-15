import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateAccessToken, generateRefreshToken, setAuthCookies, clearAuthCookies, generateRandomToken, hashToken } from '../services/token.service.js';
import { sendEmail } from '../services/email.service.js';
import { env } from '../config/env.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(StatusCodes.CONFLICT).json({ message: 'Email already in use' });
  const user = await User.create({ name, email, password, role });

  // OTP for email verification
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  user.otpCode = otp;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  await sendEmail({
    to: user.email,
    subject: 'Verify your email',
    html: `<p>Your OTP is <b>${otp}</b>. It expires in 10 minutes.</p>`
  });

  res.status(StatusCodes.CREATED).json({ message: 'Registered successfully. Please verify OTP sent to email.' });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email }).select('+otpCode +otpExpiry');
  if (!user || !user.otpCode || !user.otpExpiry) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid request' });
  if (user.otpCode !== otp || user.otpExpiry < new Date()) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid or expired OTP' });
  user.isEmailVerified = true;
  user.otpCode = undefined;
  user.otpExpiry = undefined;
  await user.save();
  res.json({ message: 'Email verified successfully' });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
  const match = await user.comparePassword(password);
  if (!match) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());
  user.lastLoginAt = new Date();
  await user.save();
  setAuthCookies(res, accessToken, refreshToken);
  res.json({ message: 'Logged in', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
  if (!token) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Refresh token missing' });
  try {
    const payload = await import('jsonwebtoken').then(m => m.default.verify(token, env.REFRESH_TOKEN_SECRET));
    const accessToken = generateAccessToken(payload.sub);
    setAuthCookies(res, accessToken, token);
    res.json({ message: 'Token refreshed' });
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid or expired refresh token' });
  }
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookies(res);
  res.json({ message: 'Logged out' });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select('+passwordResetTokenHash +passwordResetTokenExpiry');
  if (!user) return res.status(StatusCodes.OK).json({ message: 'If email exists, password reset link sent' });
  const rawToken = generateRandomToken(24);
  const tokenHash = hashToken(rawToken);
  user.passwordResetTokenHash = tokenHash;
  user.passwordResetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();
  const resetLink = `${env.CLIENT_URL}/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;
  await sendEmail({ to: user.email, subject: 'Password Reset', html: `<p>Reset your password: <a href="${resetLink}">${resetLink}</a></p>` });
  res.json({ message: 'If email exists, password reset link sent' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, token, newPassword } = req.body;
  const user = await User.findOne({ email }).select('+password +passwordResetTokenHash +passwordResetTokenExpiry');
  if (!user || !user.passwordResetTokenHash || !user.passwordResetTokenExpiry) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid request' });
  if (user.passwordResetTokenExpiry < new Date()) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Reset token expired' });
  const tokenHash = hashToken(token);
  if (tokenHash !== user.passwordResetTokenHash) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid token' });
  user.password = newPassword;
  user.passwordResetTokenHash = undefined;
  user.passwordResetTokenExpiry = undefined;
  await user.save();
  res.json({ message: 'Password reset successful' });
});

export const me = asyncHandler(async (req, res) => {
  // req.user is set by authenticate middleware
  res.json({ user: req.user });
});
import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  generateRandomToken,
  hashToken
} from '../services/token.service.js';
import { sendEmail } from '../services/email.service.js';
import { env } from '../config/env.js';

/**
 * Register user (using userId + password)
 */
export const register = asyncHandler(async (req, res) => {
  // --- SECURITY FIX: 'role' is removed from this line ---
  const { name, userId, email, password } = req.body;

  // Ensure userId and email are unique
  const existingUserId = await User.findOne({ userId });
  if (existingUserId) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ message: 'User ID already in use' });
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ message: 'Email already in use' });
  }

  // --- SECURITY FIX: 'role' is hardcoded to 'student' ---
  const user = await User.create({
    name,
    userId,
    email,
    password,
    role: 'student'
  });

  // OTP for email verification (if you still want it)
  if (email) {
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.otpCode = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Verify your email',
      html: `<p>Your OTP is <b>${otp}</b>. It expires in 10 minutes.</p>`
    });
  }

  res
    .status(StatusCodes.CREATED)
    .json({ message: 'Registered successfully. Please verify OTP if required.' });
});

/**
 * Verify OTP
 */
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email }).select('+otpCode +otpExpiry');
  if (!user || !user.otpCode || !user.otpExpiry) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Invalid request' });
  }

  if (user.otpCode !== otp || user.otpExpiry < new Date()) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Invalid or expired OTP' });
  }

  user.isEmailVerified = true;
  user.otpCode = undefined;
  user.otpExpiry = undefined;
  await user.save();

  res.json({ message: 'Email verified successfully' });
});

/**
 * Login with userId + password
 */
export const login = asyncHandler(async (req, res) => {
  console.log('Login request body:', req.body); // 🔍 Check payload from frontend

  const { userIdOrEmail, password } = req.body;

  if (!userIdOrEmail || !password) {
    console.log('Missing userIdOrEmail or password'); // 🔍 Check missing fields
    return res.status(400).json({ message: 'userIdOrEmail and password required' });
  }

  // Fetch user
  const user = await User.findOne({
    $or: [
      { userId: userIdOrEmail },
      { email: userIdOrEmail.toLowerCase() }
    ]
  }).select('+password');

  if (!user) {
    console.log('User not found'); // 🔍 Check user existence
    return res.status(401).json({ message: 'Invalid user' });
  }

  // Compare password safely
  let match;
  try {
    match = await user.comparePassword(password);
  } catch (err) {
    console.error('Password comparison failed:', err); // 🔍 Check comparePassword
    return res.status(500).json({ message: 'Internal server error during password check' });
  }

  if (!match) {
    console.log('Invalid password'); // 🔍 Wrong password
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate tokens
  let accessToken, refreshToken;
  try {
    accessToken = generateAccessToken(user._id.toString());
    refreshToken = generateRefreshToken(user._id.toString());
  } catch (err) {
    console.error('Token generation failed:', err); // 🔍 Check token creation
    return res.status(500).json({ message: 'Internal server error during token generation' });
  }

  // Save last login
  try {
    user.lastLoginAt = new Date();
    await user.save();
  } catch (err) {
    console.error('User save failed:', err); // 🔍 Check DB save
    return res.status(500).json({ message: 'Internal server error saving user' });
  }

  // Set cookies
  try {
    setAuthCookies(res, accessToken, refreshToken);
  } catch (err) {
    console.error('Setting cookies failed:', err); // 🔍 Check cookie setup
    return res.status(500).json({ message: 'Internal server error setting cookies' });
  }

  res.json({
    message: 'Logged in',
    user: {
      id: user._id,
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

/**
 * Refresh token
 */
export const refresh = asyncHandler(async (req, res) => {
  const token =
    req.cookies?.refreshToken ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Refresh token missing' });
  }

  try {
    const payload = await import('jsonwebtoken').then((m) =>
      m.default.verify(token, env.REFRESH_TOKEN_SECRET)
    );

    const accessToken = generateAccessToken(payload.sub);
    setAuthCookies(res, accessToken, token);

    res.json({ message: 'Token refreshed' });
  } catch {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Invalid or expired refresh token' });
  }
});

/**
 * Logout
 */
export const logout = asyncHandler(async (req, res) => {
  clearAuthCookies(res);
  res.json({ message: 'Logged out' });
});

/**
 * Forgot password (still email-based)
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).select(
    '+passwordResetTokenHash +passwordResetTokenExpiry'
  );

  if (!user) {
    return res
      .status(StatusCodes.OK)
      .json({ message: 'If email exists, password reset link sent' });
  }

  const rawToken = generateRandomToken(24);
  const tokenHash = hashToken(rawToken);

  user.passwordResetTokenHash = tokenHash;
  user.passwordResetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  const resetLink = `${env.CLIENT_URL}/reset-password?token=${rawToken}&email=${encodeURIComponent(
    user.email
  )}`;

  await sendEmail({
    to: user.email,
    subject: 'Password Reset',
    html: `<p>Reset your password: <a href="${resetLink}">${resetLink}</a></p>`
  });

  res.json({ message: 'If email exists, password reset link sent' });
});

/**
 * Reset password
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, token, newPassword } = req.body;

  const user = await User.findOne({ email }).select(
    '+password +passwordResetTokenHash +passwordResetTokenExpiry'
  );

  if (
    !user ||
    !user.passwordResetTokenHash ||
    !user.passwordResetTokenExpiry
  ) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Invalid request' });
  }

  if (user.passwordResetTokenExpiry < new Date()) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Reset token expired' });
  }

  const tokenHash = hashToken(token);
  if (tokenHash !== user.passwordResetTokenHash) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Invalid token' });
  }

  user.password = newPassword;
  user.passwordResetTokenHash = undefined;
  user.passwordResetTokenExpiry = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
});

/**
 * Current user profile
 */
export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
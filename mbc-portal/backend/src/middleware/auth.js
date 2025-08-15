import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import { env } from '../config/env.js';

export async function authenticate(req, res, next) {
  try {
    const token = req.cookies?.accessToken || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
    if (!token) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authentication required' });
    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('+password');
    if (!user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not found' });
    req.user = { id: user._id.toString(), role: user.role, email: user.email, name: user.name };
    next();
  } catch (err) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid or expired token' });
  }
}

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authentication required' });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Insufficient permissions' });
    }
    next();
  };
}
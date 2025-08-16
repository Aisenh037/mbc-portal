import { Router } from 'express';
import { body } from 'express-validator';
import {
  register,
  verifyOtp,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  me,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Authentication
router.post('/register',
  [
    // body('email').isEmail().normalizeEmail(),
     body('userId').notEmpty().withMessage('User ID required'),
    body('password').isLength({ min: 6 }).trim().escape(),
    body('name').optional().trim().escape(),
  ],
  register
);

router.post('/verify-otp',
  [ body('otp').isLength({ min: 4, max: 6 }).trim().escape() ],
  verifyOtp
);

router.post(
  "/login",
  [
    body("userIdOrEmail").notEmpty().trim().escape(), 
    body("password").isLength({ min: 6 })
  ],
  login
);

router.post('/logout', authenticate, logout);
router.post('/refresh', refresh);

// Password Management
router.post('/forgot-password',
  [ body('email').isEmail().normalizeEmail() ],
  forgotPassword
);

router.post('/reset-password',
  [ body('password').isLength({ min: 6 }) ],
  resetPassword
);

// Profile
router.get('/me', authenticate, me);

export default router;

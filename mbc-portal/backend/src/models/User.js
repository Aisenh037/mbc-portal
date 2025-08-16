import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export const USER_ROLES = ['developer', 'admin', 'professor', 'student'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    userId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: USER_ROLES, default: 'developer', index: true },
    isEmailVerified: { type: Boolean, default: false },

    otpCode: { type: String, select: false },
    otpExpiry: { type: Date, select: false },

    passwordResetTokenHash: { type: String, select: false },
    passwordResetTokenExpiry: { type: Date, select: false },

    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
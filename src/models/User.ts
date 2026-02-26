import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types';

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2,  'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: { values: ['buyer', 'seller', 'wholesaler'], message: 'Invalid role' },
      required: [true, 'Role is required'],
    },

    // ── Profile ──
    avatar:    { type: String, default: null },
    shopName:  { type: String, trim: true, default: null },
    nationalId: { type: String, trim: true, default: null }, // 16-digit Rwanda NID — used to look up TIN via RRA eTax

    // ── Seller / Wholesaler ──
    categories:      { type: [String], default: [] },
    experienceLevel: { type: String, default: null },
    productType:     { type: String, default: null },

    // ── Buyer ──
    interests:         { type: [String], default: [] },
    shoppingFrequency: { type: String, default: null },
    budgetRange:       { type: String, default: null },

    // ── Password Reset ──
    passwordResetToken:   { type: String, default: undefined, select: false },
    passwordResetExpires: { type: Date,   default: undefined, select: false },

    // ── Auth ──
    provider:   { type: String, enum: ['local', 'google'], default: 'local' },
    providerId: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  },
);

UserSchema.pre('save', async function (next) {
  const self = this as any;
  if (!this.isModified('password') || !self.password) return next();
  const salt = await bcrypt.genSalt(12);
  self.password = await bcrypt.hash(self.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

UserSchema.index({ provider: 1, providerId: 1 });

export default mongoose.model<IUser>('User', UserSchema);
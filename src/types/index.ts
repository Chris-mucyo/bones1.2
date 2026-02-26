import { Request } from 'express';
import { Document, Types } from 'mongoose';

export type UserRole     = 'buyer' | 'seller' | 'wholesaler';
export type AuthProvider = 'local' | 'google';

export interface IUser extends Document {
  name: any;
  _id:        Types.ObjectId;
  fullName:   string;
  email?:     string | null;
  phone?:     string | null;
  password?:  string;
  role:       UserRole;

  // Profile
  avatar?:    string | null;
  shopName?:  string | null;
  nationalId?: string | null;
  // Seller / wholesaler metadata
  categories?:       string[];
  experienceLevel?:  string | null;
  productType?:      string | null;

  // Buyer metadata
  interests?:        string[];
  shoppingFrequency?: string | null;
  budgetRange?:      string | null;
  passwordResetToken?: string;
  passwordResetExpires?: Date;

  // Auth
  provider:     AuthProvider;
  providerId?:  string | null;
  isVerified:   boolean;

  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidate: string): Promise<boolean>;
}

export interface JwtPayload {
  id:    string;
  email: string;
  role:  UserRole;
}

declare global {
  namespace Express {
    interface User extends JwtPayload {}
  }
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?:   T;
  errors?: string[];
}

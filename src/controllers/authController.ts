import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { JwtPayload, UserRole } from '../types';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../utils/email';

// POST /api/auth/register
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('[Register] body:', JSON.stringify(req.body), '| file:', !!req.file);

    const {
      fullName, email, password, role,
      shopName, nationalId, categories, interests,
      experienceLevel, productType,
      shoppingFrequency, budgetRange,
    } = req.body as Record<string, string>;

    // Duplicate email check
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      sendError(res, 'An account with this email already exists.', 409);
      return;
    }

    const avatar = req.file ? `/uploads/avatars/${req.file.filename}` : null;

    const user = await User.create({
      fullName,
      email: email.toLowerCase().trim(),
      password,
      role: role as UserRole,
      avatar,
      shopName:          shopName   || null,
      nationalId:         nationalId  || null,
      categories:        safeParseArray(categories),
      interests:         safeParseArray(interests),
      experienceLevel:   experienceLevel  || null,
      productType:       productType      || null,
      shoppingFrequency: shoppingFrequency || null,
      budgetRange:       budgetRange       || null,
    });

    const payload = { id: user._id.toString(), email: user.email || '', role: user.role };
    const accessToken  = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Send welcome email (non-blocking — don't fail registration if email fails)
    if (user.email) {
      sendWelcomeEmail({ to: user.email, name: user.fullName, role: user.role })
        .catch(err => console.error('[Welcome email failed]', err));
    }

    sendSuccess(res, 'Account created successfully', {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    }, 201);

  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      sendError(res, 'Invalid email or password.', 401);
      return;
    }

    const payload = { id: user._id.toString(), email: user.email || '', role: user.role };
    sendSuccess(res, 'Login successful', {
      user: sanitizeUser(user),
      accessToken:  generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
    });

  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById((req.user as JwtPayload)?.id);
    if (!user) { sendError(res, 'User not found.', 404); return; }
    sendSuccess(res, 'User fetched', { user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/refresh
export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken: token } = req.body as { refreshToken: string };
    if (!token) { sendError(res, 'Refresh token required.', 400); return; }

    const decoded = verifyRefreshToken(token);
    const user    = await User.findById(decoded.id);
    if (!user) { sendError(res, 'User no longer exists.', 401); return; }

    const payload = { id: user._id.toString(), email: user.email || '', role: user.role };
    sendSuccess(res, 'Token refreshed', {
      accessToken:  generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
    });
  } catch {
    sendError(res, 'Invalid or expired refresh token.', 401);
  }
};

// PUT /api/auth/profile
export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId  = (req.user as JwtPayload)?.id;
    const updates: Record<string, unknown> = {};

    const allowed = [
      'fullName', 'shopName', 'nationalId', 'categories', 'interests',
      'shoppingFrequency', 'budgetRange', 'experienceLevel', 'productType',
    ];

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = (key === 'categories' || key === 'interests')
          ? safeParseArray(req.body[key])
          : req.body[key];
      }
    }

    if (req.file) updates['avatar'] = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
    if (!user) { sendError(res, 'User not found.', 404); return; }

    sendSuccess(res, 'Profile updated', { user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

// ── Helpers ──
function safeParseArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try { return JSON.parse(value as string); } catch { return []; }
}

function sanitizeUser(user: InstanceType<typeof User>) {
  return {
    id:                user._id,
    fullName:          user.fullName,
    email:             user.email,
    role:              user.role,
    avatar:            user.avatar,
    shopName:          user.shopName,
    nationalId:         user.nationalId,
    categories:        user.categories,
    interests:         user.interests,
    experienceLevel:   user.experienceLevel,
    productType:       user.productType,
    shoppingFrequency: user.shoppingFrequency,
    budgetRange:       user.budgetRange,
    isVerified:        user.isVerified,
  };
}


// ─────────────────────────────────────────────
// POST /api/auth/forgot-password
// ─────────────────────────────────────────────
import crypto from 'crypto';

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body as { email: string };
    const user = await User.findOne({ email: email?.toLowerCase().trim() });

    // Always respond the same — don't reveal if email exists
    if (!user) {
      sendSuccess(res, 'If that email exists, a reset link has been sent.', undefined, 200);
      return;
    }

    // Generate secure token
    const rawToken   = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expires     = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save to user — requires these fields on the model
    (user as any).passwordResetToken   = hashedToken;
    (user as any).passwordResetExpires = expires;
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${rawToken}`;

    // Send the reset email
    if (user.email) {
      await sendPasswordResetEmail({
        to:       user.email,
        name:     user.fullName,
        resetURL,
      });
    }

    sendSuccess(res, 'If that email exists, a reset link has been sent.', undefined, 200);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// POST /api/auth/reset-password
// ─────────────────────────────────────────────
export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, newPassword } = req.body as { token: string; newPassword: string };

    if (!token || !newPassword) {
      sendError(res, 'Token and new password are required.', 400);
      return;
    }
    if (newPassword.length < 8) {
      sendError(res, 'Password must be at least 8 characters.', 400);
      return;
    }

    // Hash the raw token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await (User as any).findOne({
      passwordResetToken:   hashedToken,
      passwordResetExpires: { $gt: new Date() }, // not expired
    });

    if (!user) {
      sendError(res, 'Reset link is invalid or has expired.', 400);
      return;
    }

    user.password               = newPassword;
    user.passwordResetToken     = undefined;
    user.passwordResetExpires   = undefined;
    await user.save();

    sendSuccess(res, 'Password reset successfully. You can now sign in.', undefined, 200);
  } catch (error) {
    next(error);
  }
};
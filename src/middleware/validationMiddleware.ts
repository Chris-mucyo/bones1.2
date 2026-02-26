import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(e => e.msg);
    console.error('[Validation]', messages);
    sendError(res, messages[0], 400, messages);
    return;
  }
  next();
};

// ── Register ──────────────────────────────────────────────────────────────
export const registerValidation = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters'),

  // Only validate email format if a non-empty email was actually sent
  body('email').custom((value) => {
    if (!value || value.trim() === '') return true; // skip — not provided
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    if (!valid) throw new Error('Enter a valid email address');
    return true;
  }),

  // Only validate phone format if a non-empty phone was actually sent
  body('phone').custom((value) => {
    if (!value || value.trim() === '') return true; // skip — not provided
    const valid = /^\+?[0-9]{9,15}$/.test(value.trim());
    if (!valid) throw new Error('Enter a valid phone number');
    return true;
  }),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['buyer', 'seller', 'wholesaler']).withMessage('Role must be buyer, seller, or wholesaler'),

  // Optional profile fields — sanitize only
  body('shopName').optional().trim(),
  body('categories').optional(),
  body('interests').optional(),
  body('experienceLevel').optional().trim(),
  body('productType').optional().trim(),
  body('shoppingFrequency').optional().trim(),
  body('budgetRange').optional().trim(),

  handleValidationErrors,
];

// ── Login ─────────────────────────────────────────────────────────────────
export const loginValidation = [
  body('email').custom((value) => {
    if (!value || value.trim() === '') return true;
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    if (!valid) throw new Error('Enter a valid email address');
    return true;
  }),

  body('phone').optional().trim(),

  body('password').notEmpty().withMessage('Password is required'),

  handleValidationErrors,
];
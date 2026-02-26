import { Router, type Router as ExpressRouter } from 'express';
import { register, login, getMe, refreshToken, updateProfile, forgotPassword, resetPassword } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { registerValidation, loginValidation } from '../middleware/validationMiddleware';
import { uploadAvatar } from '../middleware/upload';

const router: ExpressRouter = Router();

// Public
router.post('/register', uploadAvatar, registerValidation, register);
router.post('/login',    loginValidation, login);
router.post('/refresh',  refreshToken);

// Password reset (public)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password',  resetPassword);

// Protected
router.get('/me',             protect, getMe);
router.put('/profile',        protect, uploadAvatar, updateProfile);

export default router;
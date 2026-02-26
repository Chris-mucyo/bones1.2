import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import passport from 'passport';
import authRoutes  from './routes/authRoutes';
import oauthRoutes from './routes/oauthRoutes';
import { errorHandler } from './middleware/errorMiddleware';

const app = express();

// ── Security & Logging ──
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── CORS ──
app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  credentials: true,
}));

// ── Body parsers ──
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static — serve uploaded avatars ──
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Passport ──
app.use(passport.initialize());

// ── Routes ──
app.use('/api/auth',  authRoutes);
app.use('/api/auth',  oauthRoutes);

// ── Health check ──
app.get('/health', (_req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// ── Error handler (must be last) ──
app.use(errorHandler);

export default app;

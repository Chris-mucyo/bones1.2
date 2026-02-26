import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';

export const generateAccessToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!secret) throw new Error('JWT_SECRET is not defined');

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

  if (!secret) throw new Error('JWT_REFRESH_SECRET is not defined');

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  return jwt.verify(token, secret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET is not defined');
  return jwt.verify(token, secret) as JwtPayload;
};

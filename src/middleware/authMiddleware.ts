import { Request, Response, NextFunction } from 'express';
import { UserRole, JwtPayload } from '../types';
import { verifyAccessToken } from '../utils/jwt';
import { sendError } from '../utils/response';

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'No token provided. Access denied.', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    // Attach to req.user — now compatible with Express.User namespace
    req.user = decoded as JwtPayload;
    next();

  } catch {
    sendError(res, 'Invalid or expired token.', 401);
  }
};

export const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as JwtPayload | undefined;

    if (!user || !roles.includes(user.role)) {
      sendError(res, 'You do not have permission to perform this action.', 403);
      return;
    }
    next();
  };
};
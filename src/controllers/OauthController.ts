import { Request, Response } from 'express';
import { IUser } from '../types';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

export const googleCallback = (req: Request, res: Response): void => {
  try {
    const user = req.user as IUser;

    if (!user) {
      res.redirect(`${process.env.OAUTH_FAILURE_URL}`);
      return;
    }

    const payload = {
      id:    user._id.toString(),
      email: user.email as string,
      role:  user.role,
    };

    const accessToken  = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const userData = encodeURIComponent(JSON.stringify({
      id:         user._id,
      name:       user.name,
      email:      user.email,
      role:       user.role,
      avatar:     user.avatar,
      isVerified: user.isVerified,
    }));

    res.redirect(
      `${process.env.OAUTH_SUCCESS_URL}?accessToken=${accessToken}&refreshToken=${refreshToken}&user=${userData}`
    );

  } catch {
    res.redirect(`${process.env.OAUTH_FAILURE_URL}`);
  }
};
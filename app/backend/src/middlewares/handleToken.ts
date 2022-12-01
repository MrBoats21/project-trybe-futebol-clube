import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export default async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.header('Authorization');

  try {
    const key = jwt.verify(auth as string, process.env.JWT_SECRET as string);

    req.body.user = key;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
};

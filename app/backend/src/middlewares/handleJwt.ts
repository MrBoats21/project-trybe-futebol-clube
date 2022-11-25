import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export default async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.header('Authorization');

  if (!auth) {
    return res.status(401).json();
  }

  const key = jwt.verify(auth, process.env.JWT_SECRET as string);

  req.body.user = key;

  next();
};

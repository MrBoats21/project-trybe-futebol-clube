import { Request, Response } from 'express';
import exception from '../utils';

const handleError = (err: Error, req: Request, res: Response) => {
  console.log('err', err);
  const { status, message } = err as exception;
  res.status(status || 500).json({ message });
};

export default handleError;

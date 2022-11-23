import { Request, Response } from 'express';
import LoginService from '../service/login.service';

export default class LoginController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password || password.length < 6) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    const token = await LoginService.validateLogin(email, password);
    res.status(200).json({ token });
  }
}

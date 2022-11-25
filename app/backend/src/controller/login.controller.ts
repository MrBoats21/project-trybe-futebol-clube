import { Request, Response } from 'express';
import LoginService from '../service/login.service';

export default class LoginController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const token = await LoginService.handleLogin(email, password);

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    if (!token) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
    res.status(200).json({ token });
  }

  static async getByRole(req: Request, res: Response) {
    const info = await LoginService.checkRole(req.body.user);
    res.status(200).json({ role: info });
  }
}

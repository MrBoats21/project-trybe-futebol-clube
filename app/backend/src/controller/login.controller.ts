import { Request, Response } from 'express';
import LoginService from '../service/login.service';

export default class LoginController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const token = await LoginService.validateLogin(email, password);
    res.status(200).json({ token });
  }
}

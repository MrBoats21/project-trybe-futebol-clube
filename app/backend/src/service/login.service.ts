import { compareSync } from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import Users from '../database/models/UserModel';
import ILogin from '../interfaces/ILogin';

export default class LoginService {
  static async handleLogin(email: string, password: string) {
    const login = await Users.findOne({ where: { email } });
    const access = login && compareSync(password, login.password);

    if (access) {
      const secret = process.env.JWT_SECRET || 'jwt_secret';
      const token = jwt.sign({ email }, secret);

      return token;
    }

    return null;
  }

  static async checkRole(body: ILogin): Promise<string> {
    const { email } = body;
    const userInfo = await Users.findOne({ where: { email } });

    return userInfo?.dataValues.role;
  }
}

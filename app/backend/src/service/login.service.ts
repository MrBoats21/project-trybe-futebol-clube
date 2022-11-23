import { compareSync } from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import Users from '../database/models/UserModel';

export default class LoginService {
  static async validateLogin(email: string, password: string): Promise<string | null> {
    const login = await Users.findOne({ where: { email } });
    const access = login && compareSync(password, login.password);

    if (access) {
      const jwtSecret = process.env.JWT_SECRET || 'jwt_secret';
      const token = jwt.sign({ email }, jwtSecret);

      return token;
    }

    return null;
  }
}

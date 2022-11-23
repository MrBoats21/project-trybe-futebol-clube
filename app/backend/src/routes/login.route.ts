import * as express from 'express';
import LoginController from '../controller/login.controller';

const route = express.Router();

route.post('/', LoginController.login);

export default route;
